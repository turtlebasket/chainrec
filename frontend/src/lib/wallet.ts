import { MsgExecuteContract, SecretNetworkClient } from 'secretjs';
import { browser } from '$app/env';
import { writable, get } from 'svelte/store';
import type { Window as KeplrWindow, Keplr } from "@keplr-wallet/types";
import type { Entry, EntryAnon } from './types';
import { BroadcastTxRequest } from 'secretjs/dist/protobuf_stuff/cosmos/tx/v1beta1/service';

declare global { // See keplr docs: https://docs.keplr.app/api/#using-with-typescript
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Window extends KeplrWindow { }
}

// keplr
export const keplrInstalled = writable<boolean>(browser ? (window.keplr ? true : false) : false);
export const keplrConnected = writable<boolean>();
export const keplr = writable<Keplr>();
export const walletAddress = writable<string>();
export const offlineSigner = writable<any>();
export const secretClient = writable<SecretNetworkClient>();

// import env
const chainId = import.meta.env.VITE_CHAIN_ID; // should be secret-4 in prod builds
const secretGrpcUrl = import.meta.env.VITE_SECRET_GRPC_URL;

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
        walletAddress.set(
            accounts.filter((item) => {
                const addr = item.address;
                return addr.slice(0, 6) == 'secret';
            })[0].address
        );
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
    const q = { get_records_all: { } }
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

// ------ HANDLERS ------

export async function createCopyrightRecord( entry: string, entryInfo: string, userInfo: string ) {
    const createRecordMsg = new MsgExecuteContract({
        sender: get(walletAddress),
        contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
        msg: {
            create_record: {
                user_info: userInfo,
                entry_info: entryInfo,
                entry: entry,
            }
        },
        codeHash: import.meta.env.VITE_CONTRACT_CODEHASH
    })
    const tx = await get(secretClient).tx.broadcast([createRecordMsg], {
        gasLimit: 40_000,
    })
    return tx
}
