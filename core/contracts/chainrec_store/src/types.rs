use cosmwasm_std::HumanAddr;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CopyrightEntry {
    pub entry: String, 
    pub owner: HumanAddr,
    pub user_info: String,
    pub entry_info: String,
    pub timestamp: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CopyrightEntryPublic {
    pub entry: String,
    pub owner: HumanAddr,
    pub entry_info: String,
    pub timestamp: u32,
}

impl CopyrightEntryPublic {
    pub fn from(entry: CopyrightEntry) -> Self {
        CopyrightEntryPublic {
            entry: entry.entry,
            owner: entry.owner,
            entry_info: entry.entry_info,
            timestamp: entry.timestamp,
        }
    }
}