const { Contract, getAccountByName } = require("secret-polar");

async function run() {
    let account_0 = getAccountByName("account_0");

    let store_contract = new Contract("chainrec_store");
    await store_contract.parseSchema();

    const deploy_info = await store_contract.deploy(account_0, {
        amount: [{ amount: "750000", denom: "uscrt" }],
        gas: "3000000",
    });

    const instantiate_info = await store_contract.instantiate(
        {},
        Math.random().toString(36),
        account_0
    );

    console.log(`Address: ${instantiate_info.contractAddress}\nCode hash: ${deploy_info.contractCodeHash}`)
}

module.exports = { default: run };
