use cosmwasm_std::{
    debug_print, to_binary, Api, Binary, CanonicalAddr, Env, Extern, HandleResponse, InitResponse,
    Querier, StdResult, Storage, StdError,
};
use secret_toolkit::permit::{validate, Permit};

use crate::msg::{HandleMsg, InitMsg, QueryMsg, QueryWithPermit};
use crate::state::{
    get_all_copyright_entries, get_all_copyright_entries_backpaginate, get_config,
    get_copyright_entry_full, get_range_copyright_entries, get_user_copyright_entries,
    new_copyright_entry, set_config, Config,
};
use crate::types::CopyrightEntry;

pub const PREFIX_REVOKED_PERMITS: &str = "rp";

pub fn init<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    _msg: InitMsg,
) -> StdResult<InitResponse> {
    let state = Config {
        creator: deps.api.canonical_address(&env.message.sender)?,
        contract_address: env.contract.address,
    };

    set_config(&mut deps.storage, &state);

    debug_print!("Contract was initialized by {}", env.message.sender);

    Ok(InitResponse::default())
}

pub fn handle<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    msg: HandleMsg,
) -> StdResult<HandleResponse> {
    match msg {
        HandleMsg::CreateRecord {
            user_info,
            entry_info,
            entry,
        } => {
            if entry.len() != 64 {
                return Err(StdError::generic_err("Content hash must be 64 characters long"));
            }

            let new_entry = CopyrightEntry {
                user_info,
                entry_info,
                entry,
                owner: env.message.sender.clone(),
                // timestamp: env.block.time as u32,
                timestamp: env.block.time as u32,
            };

            new_copyright_entry(
                &mut deps.storage,
                CanonicalAddr::from(env.message.sender.as_str().as_bytes()),
                new_entry,
            );

            Ok(HandleResponse {
                messages: vec![], // no Cosmos SDK messages (i.e. transfers)
                log: vec![],
                data: None,
            })
        }
    }
}

pub fn query<S: Storage, A: Api, Q: Querier>(
    deps: &Extern<S, A, Q>,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetRecordsAll {} => to_binary(&get_all_copyright_entries(&deps.storage)),
        QueryMsg::GetRecordsAllPaginateBack { limit } => to_binary(
            &get_all_copyright_entries_backpaginate(&deps.storage, limit as usize),
        ),
        QueryMsg::GetRecordsRange { start, stop } => to_binary(&get_range_copyright_entries(
            &deps.storage,
            start as usize,
            stop as usize,
        )),
        QueryMsg::GetRecordsUser { address } => to_binary(&get_user_copyright_entries(
            &deps.storage,
            CanonicalAddr::from(address.as_bytes()),
        )?),
        QueryMsg::WithPermit { permit, query } => to_binary(&permit_query(deps, permit, query)),
    }
}

pub fn permit_query<S: Storage, A: Api, Q: Querier>(
    deps: &Extern<S, A, Q>,
    permit: Permit,
    query: QueryWithPermit,
) -> StdResult<Binary> {
    // First, validate user using permit
    let address = get_config(&deps.storage).contract_address;
    let v_user = validate(deps, PREFIX_REVOKED_PERMITS, &permit, address, None)?;

    match query {
        QueryWithPermit::GetFullRecord { id } => to_binary(&get_copyright_entry_full(
            &deps.storage,
            CanonicalAddr::from(v_user.as_bytes()),
            id,
        )),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env};
    use cosmwasm_std::{coins, from_binary, StdError};

    #[test]
    fn working_init() {
        let mut deps = mock_dependencies(20, &[]);
        let env = mock_env("creator", &[]);

        let res = init(&mut deps, env, InitMsg {}).unwrap();

        assert_eq!(0, res.messages.len());
    }
}