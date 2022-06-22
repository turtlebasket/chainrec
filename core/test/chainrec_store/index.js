// For reference, see documentation at: https://docs.arufaresearch.com/guides/testing.html
const { expect, use } = require("chai");
const { random } = require('./util');
const { polarChai, getAccountByName, Contract } = require("secret-polar");

use(polarChai);

describe("chainrec_store", () => {
    let contract;
    const contract_owner = getAccountByName("account_0");
    const other = getAccountByName("account_1");
    let item = {
        entry_info: "Tale of the Bees",
        entry: "fe2445b0ebf4e8492f6778682fa8a28ad6f8357b1f0a743245ec13a80cf9918c",
        user_info: "J.R.R. Tolkien Jr.",
    }
    let item2 = {
        entry_info: "Tale of the Bees: Reloaded",
        entry: "fe2445b0ebf4e8492f6778682fa8a28ad6f8357b1f0a743245ec13a80cf9918c",
        user_info: "J.R.R. Tolkien Jr.",
    }
    let item3 = {
        entry_info: "Tale of the Fleas",
        entry: "fe2445b0ebf4e8492f6778682fa8a28ad6f8357b1f0a743245ec13a80cf9918c",
        user_info: "J.R.R. Tolkien III",
    }

    before(async () => {
        contract = new Contract("chainrec_store");
        await contract.parseSchema();
        await contract.deploy(contract_owner, {
            amount: [{ amount: "750000", denom: "uscrt" }], gas: "3000000",
        });
        await contract.instantiate({}, "deploy test", contract_owner);
    })

    it("Can write copyright records", async () => {
        await contract.tx.create_record({ account: contract_owner }, item)
        await contract.tx.create_record({ account: contract_owner }, item2)
        await contract.tx.create_record({ account: other }, item3)
    })

    it("Can read all copyright records", async () => {
        const res = await contract.query.get_records_all()
        // console.log(`ALL RES: ${JSON.stringify(res)}`)
        await expect(res["Ok"]).to.have.length(3);
    })

    it("Can back-paginate copyright records by time", async () => {
        const res = await contract.query.get_records_all_paginate_back({ limit: 2 })
        await expect(res["Ok"]).to.have.length(2);
    })

    it("Can read user copyright records", async () => {
        const res = await contract.query.get_records_user({ address: contract_owner.account.address })
        const res2 = await contract.query.get_records_user({ address: other.account.address })
        await expect(res).to.have.length(2); // account_0 has two records
        await expect(res2).to.have.length(1); // account_1 has one record
    })


    // it ("Can access own but not others' copyright records", async () => {
    //     const res = await contract.query.with_permit(permit, { get_full_record: { id: 0 } })
    // })
})
