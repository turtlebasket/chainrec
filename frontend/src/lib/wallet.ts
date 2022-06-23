import { MsgExecuteContract, SecretNetworkClient, type Permit } from 'secretjs';
import { browser } from '$app/env';
import { writable, get } from 'svelte/store';
import type { Window as KeplrWindow, Keplr } from "@keplr-wallet/types";
import type { Entry, EntryAnon } from './types';
import type { AminoSignResponse } from 'secretjs/dist/wallet_amino';

declare global { // See keplr docs: https://docs.keplr.app/api/#using-with-typescript
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Window extends KeplrWindow { }
}

// keplr
export const keplrInstalled = writable<boolean>(browser ? (window.keplr ? true : false) : false);
export const keplrConnected = writable<boolean>();
export const keplr = writable<Keplr>();
export const walletAddress = writable<string>();
// export const wallletAddressBech32 = writable<string>();
export const offlineSigner = writable<any>();
export const secretClient = writable<SecretNetworkClient>();
export const readPermit = writable<Permit>(); 

if (browser) {
    readPermit.set(JSON.parse(localStorage.getItem('read_permit')) ?? null)
}

// import env
const chainId = import.meta.env.VITE_CHAIN_ID; // should be secret-4 in prod builds
const secretGrpcUrl = import.meta.env.VITE_SECRET_GRPC_URL;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const codeHash = import.meta.env.VITE_CONTRACT_CODEHASH;

export async function tryInitKeplr() {
    if (typeof get(secretClient) === 'undefined') {
        if (browser) {
            if (typeof window.keplr !== 'undefined') {
                keplr.set(window.keplr);
                keplrInstalled.set(true);
            } else {
                keplrInstalled.set(false);
            }

            await enableKeplr(async (address) => {
                const oSigner = get(offlineSigner) ?? await window.keplr.getOfflineSigner(chainId);
                const enigmaUtils = await window.getEnigmaUtils(chainId);
                const sClient = await SecretNetworkClient.create({
                    grpcWebUrl: secretGrpcUrl,
                    chainId: chainId,
                    wallet: oSigner,
                    walletAddress: address,
                    encryptionUtils: enigmaUtils
                });
                secretClient.set(sClient)
            });
        }
    }
}

export async function enableKeplr(addressCallback = null) {
    try {
        await get(keplr).enable(chainId);
        offlineSigner.set(get(keplr).getOfflineSigner(chainId));
        const accounts = await get(offlineSigner).getAccounts();
        const acc = accounts.filter((item) => {
            const addr = item.address;
            return addr.slice(0, 6) == 'secret';
        })[0]
        walletAddress.set(acc.address);
        await addressCallback(get(walletAddress));
        keplrConnected.set(true);
    } catch (e) {
        console.log(e);
    }
}

export async function ensureKeplr() {
    if (typeof get(secretClient) === 'undefined') {
        await tryInitKeplr()
    }
}

// ------ QUERIES ------

export async function anonListQuery(query): Promise<EntryAnon[]> {
    await ensureKeplr()
    try {
        let data: any[] = await get(secretClient).query.compute.queryContract({
            contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
            codeHash: import.meta.env.VITE_CONTRACT_CODEHASH,
            query: query
        })
        if (data['Ok'] != undefined) { // sometimes returns everything inside an Ok for some reason, just handle it
            data = data['Ok']
        }
        const entries: EntryAnon[] = [];
        for (const entry of data) {
            entries.push({
                ownerAddress: entry.owner,
                entryInfo: entry.entry_info,
                timestamp: entry.timestamp,
                entry: entry.entry,
            });
        }
        return entries
    }
    // NOTE: Contract panics if there are no entries in the store (store has not
    // yet been initialized), so that is handled here
    catch (e) {
        console.log(`Query failed: ${e}`)
        return []
    }
}

export async function queryAllRecords(): Promise<EntryAnon[]> {
    const q = { get_records_all: {} }
    return await anonListQuery(q)
}

export async function queryLastRecordsRange(limit: number): Promise<EntryAnon[]> {
    const q = { get_records_all_paginate_back: { limit: limit } }
    return await anonListQuery(q)
}

export async function queryUserRecords(): Promise<EntryAnon[]> {
    const q = { get_records_user: { address: get(secretClient).address } }
    return await anonListQuery(q)
}

export async function queryFullUserRecords(): Promise<Entry[]> {
    if (get(readPermit) == null) {
        const permitName = "test"
        const resp: AminoSignResponse = await window.keplr.signAmino(
            chainId,
            get(secretClient).address,
            {
                chain_id: chainId,
                account_number: "0", // Must be 0
                sequence: "0", // Must be 0
                fee: {
                    amount: [{denom: "uscrt", amount: "0"}], // Must be 0 uscrt
                    gas: "1", // Must be 1
                },
                msgs: [
                    {
                        type: "query_permit", // Must be "query_permit"
                        value: {
                            permit_name: permitName,
                            allowed_tokens: [contractAddress],
                            permissions: [],
                        },
                    },
                ],
                memo: "", // Must be empty
            },
            {
                preferNoSetFee: true, // Fee must be 0, so hide it from the user
                preferNoSetMemo: true, // Memo must be empty, so hide it from the user
            }
        )
        const permit: Permit = {
            params: {
                permit_name: permitName,
                allowed_tokens: [contractAddress],
                chain_id: chainId,
                permissions: []
            },
            signature: resp.signature
        };
        readPermit.set(permit)
        console.log(`permit1: ${JSON.stringify(get(readPermit))}`)
        localStorage.setItem('read_permit', JSON.stringify(permit))
    }

    try {
        let data: any = await get(secretClient).query.compute.queryContract({
            contractAddress: contractAddress,
            codeHash: codeHash,
            query: {
                with_permit: {
                    permit: get(readPermit),
                    query: { get_full_user_records: { } }
                }
            }
        })
        console.log(data);
        if (data['Ok'] != undefined) { // sometimes returns everything inside an Ok for some reason, just handle it
            data = data['Ok']
        }
        const entries: Entry[] = [];
            for (const entry of data) {
                entries.push({
                    ownerAddress: entry.owner,
                    entryInfo: entry.entry_info,
                    userInfo: entry.user_info,
                    timestamp: entry.timestamp,
                    entry: entry.entry
                })
            }
        return entries;
    }
    catch (e) {
        console.log(`Query failed: ${e}`)
        return []
    }
}

// ------ HANDLERS ------

export async function createRecord(entry: string, entryInfo: string, userInfo: string) {
    const createRecordMsg = new MsgExecuteContract({
        sender: get(walletAddress),
        contractAddress: contractAddress,
        msg: {
            create_record: {
                user_info: userInfo,
                entry_info: entryInfo,
                entry: entry,
            }
        },
        codeHash: codeHash
    })
    const tx = await get(secretClient).tx.broadcast([createRecordMsg], {
        gasLimit: 40_000,
    })
    return tx
}
