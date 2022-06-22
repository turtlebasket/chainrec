export type Entry = {
    ownerAddress: string,
    entryInfo: string,
    userInfo: string,
    entry: string,
    timestamp: number,
}

export type EntryAnon = {
    ownerAddress: string,
    entryInfo: string,
    entry: string,
    timestamp: number,
}

export function asFullEntry(anon: EntryAnon) {
    const x: Entry = {
        ownerAddress: anon.ownerAddress,
        entryInfo: anon.entryInfo,
        entry: anon.entry,
        timestamp: anon.timestamp,
        userInfo: null
    }
    return x
}