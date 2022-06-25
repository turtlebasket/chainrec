use std::{any::type_name};

use schemars::JsonSchema;
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use cosmwasm_std::{CanonicalAddr, HumanAddr, ReadonlyStorage, StdError, StdResult, Storage};
use cosmwasm_storage::{PrefixedStorage, ReadonlyPrefixedStorage};

use secret_toolkit::{
    serialization::{Bincode2, Serde},
    storage::{AppendStore, AppendStoreMut},
};

use crate::types::{EntryPublic, Entry};

pub const PREFIX_CONFIG: &[u8] = b"c";
pub const PREFIX_STATE: &[u8] = b"s";
pub const PREFIX_USER_ENTRIES: &[u8] = b"ue";
pub const PREFIX_ANON_ENTRIES: &[u8] = b"ae";

// CONFIG

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub creator: CanonicalAddr,
    pub contract_address: HumanAddr,
}

fn save<T: Serialize, S: Storage>(storage: &mut S, key: &[u8], value: &T) {
    storage.set(key, &Bincode2::serialize(value).unwrap());
}

fn load<T: DeserializeOwned, S: ReadonlyStorage>(storage: &S, key: &[u8]) -> StdResult<T> {
    Bincode2::deserialize(
        &storage
            .get(key)
            .ok_or_else(|| StdError::not_found(type_name::<T>()))?,
    )
}

pub fn get_config<S: ReadonlyStorage>(store: &S) -> Config {
    return load(store, PREFIX_CONFIG).unwrap();
}

pub fn set_config<S: Storage>(store: &mut S, config: &Config) {
    return save(store, PREFIX_CONFIG, config);
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub records: u32,
}

pub fn get_state<S: ReadonlyStorage>(store: &S) -> State {
    return load(store, PREFIX_STATE).unwrap();
}

pub fn set_state<S: Storage>(store: &mut S, state: &State) {
    return save(store, PREFIX_STATE, state);
}

/// Increments number of records. Should be called in the handler for creating records.
pub fn increment_records<S: Storage>(store: &mut S) {
    let mut old = get_state(store);
    old.records += 1;
    set_state(store, &old);
}

pub fn get_num_records<S: Storage>(store: &S) -> u32 {
    return get_state(store).records;
}

// Storage format for events
// ---
// Index all events for each user under 1 key. Each key is made
// up of the event prefix ("e") plus the user's address.

/// Write a new entry for a user
pub fn new_entry<S: Storage>(
    storage: &mut S,
    user: CanonicalAddr,
    entry: Entry,
) {
    let u_pref = &[PREFIX_USER_ENTRIES, user.as_slice()];

    // push to user store
    let mut user_store: PrefixedStorage<S> =
        PrefixedStorage::multilevel(u_pref, storage);
    let mut user_entry_store: AppendStoreMut<Entry, PrefixedStorage<S>> =
        AppendStoreMut::attach_or_create(&mut user_store).unwrap();
    user_entry_store.push(&entry).unwrap();

    // add reference to public user list
    let mut anon_store: PrefixedStorage<S> = PrefixedStorage::multilevel(
        &[PREFIX_ANON_ENTRIES],
        storage,
    );
    let mut anon_entry_store: AppendStoreMut<EntryPublic, PrefixedStorage<S>> =
        AppendStoreMut::attach_or_create(&mut anon_store).unwrap();
    anon_entry_store.push(&EntryPublic::from(entry)).unwrap();
}

/// Get the list of public entries from all users
pub fn get_all_entries<S: ReadonlyStorage>(
    storage: &S,
) -> StdResult<Vec<EntryPublic>> {
    let anon_store: ReadonlyPrefixedStorage<S> =
        ReadonlyPrefixedStorage::multilevel(&[PREFIX_ANON_ENTRIES], storage);
    let entry_store: AppendStore<_, ReadonlyPrefixedStorage<S>> =
        AppendStore::attach(&anon_store).unwrap().unwrap();
    Ok(entry_store
        .iter()
        .map(|entry| entry.unwrap())
        .collect::<Vec<EntryPublic>>())
}

pub fn get_all_entries_backpaginate<S: ReadonlyStorage>(
    storage: &S,
    range: usize
) -> StdResult<Vec<EntryPublic>> {

    let anon_store: ReadonlyPrefixedStorage<S> =
        ReadonlyPrefixedStorage::multilevel(&[PREFIX_ANON_ENTRIES], storage);
    let entry_store: AppendStore<_, ReadonlyPrefixedStorage<S>> =
        AppendStore::attach(&anon_store).unwrap().unwrap();
    Ok(entry_store
        .iter()
        .skip(entry_store.len() as usize - range)
        .take(range)
        .map(|entry| entry.unwrap())
        .collect::<Vec<EntryPublic>>())
}

/// Get the list of all entries for all users & convert to anonymous format
pub fn get_range_entries<S: ReadonlyStorage>(
    storage: &S,
    start: usize,
    stop: usize,
) -> StdResult<Vec<EntryPublic>> {
    let anon_store: ReadonlyPrefixedStorage<S> =
        ReadonlyPrefixedStorage::multilevel(&[PREFIX_ANON_ENTRIES], storage);
    let entry_store: AppendStore<_, ReadonlyPrefixedStorage<S>> =
        AppendStore::attach(&anon_store).unwrap().unwrap();
    Ok(entry_store
        .iter()
        .skip(start)
        .take(stop - start)
        .map(|entry| entry.unwrap())
        .collect::<Vec<EntryPublic>>())
}

/// Get the list of all entries for a user & convert to anonymous format
pub fn get_user_entries<S: ReadonlyStorage>(
    storage: &S,
    user: CanonicalAddr,
) -> StdResult<Vec<EntryPublic>> {
    let user_store: ReadonlyPrefixedStorage<S> =
        ReadonlyPrefixedStorage::multilevel(&[PREFIX_USER_ENTRIES, user.as_slice()], storage);
    let entry_store: AppendStore<_, ReadonlyPrefixedStorage<S>> =
        AppendStore::attach(&user_store).unwrap().unwrap();
    Ok(entry_store
        .iter()
        .map(|entry| EntryPublic::from(entry.unwrap()))
        .collect::<Vec<EntryPublic>>())
}

/// Get full entry for a user
pub fn get_user_entries_full<S: ReadonlyStorage>(
    storage: &S,
    user: CanonicalAddr,
) -> StdResult<Vec<Entry>> {
    let user_store: ReadonlyPrefixedStorage<S> =
        ReadonlyPrefixedStorage::multilevel(&[PREFIX_USER_ENTRIES, user.as_slice()], storage);
    let entry_store: AppendStore<_, ReadonlyPrefixedStorage<S>> =
        AppendStore::attach(&user_store).unwrap().unwrap();
    Ok(entry_store
        .iter()
        .map(|i| i.unwrap())
        .collect::<Vec<Entry>>())
}
