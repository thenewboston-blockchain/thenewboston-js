module.exports = {
  valid: {
    message: {
      block: {
        account_number: "a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f",
        message: {
          balance_key: "477476a4d1ed015bc8e4e4bc9e164048d7d13212568093969ebd37070ce97f6e",
          txs: [
            {
              amount: 1,
              fee: "PRIMARY_VALIDATOR",
              recipient: "4afb3eaad999e4c073be0fbde86b76f9370d53b398b9cab9d760825709a1d6b3",
            },
            {
              amount: 1,
              memo: "Yo",
              recipient: "b6e21072b6ba2eae6f78bc3ade17f6a561fa4582d5494a5120617f2027d38797",
            },
            {
              amount: 1,
              fee: "BANK",
              recipient: "e3a94381f8db207ddad931391886d611d6f4c060d0db2b0e373738e2f4db96d6",
            },
          ],
        },
        signature:
          "6293452496c618d831b7ddcf5443b9f92fa06133a5c0c2fdade0dca438dbc2bcdc3112e05dee7c40c00064dc904f91a05b5034d11a49b2a4e49097b1d6c4060d",
      },
      block_identifier: "f0b89767914480ebd12301e11580b08ca2a53cf3f14adf3d2afd7b3e5e7e6d74",
      updated_balances: [
        {
          account_number: "4afb3eaad999e4c073be0fbde86b76f9370d53b398b9cab9d760825709a1d6b3",
          balance: 7,
        },
        {
          account_number: "a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f",
          balance: 408169,
          balance_lock: "2d6eb919aa0b5476da5a0909d25c00298d276ba502e2f222064062bda034dfa1",
        },
        {
          account_number: "b6e21072b6ba2eae6f78bc3ade17f6a561fa4582d5494a5120617f2027d38797",
          balance: 11837,
        },
        {
          account_number: "e3a94381f8db207ddad931391886d611d6f4c060d0db2b0e373738e2f4db96d6",
          balance: 1,
        },
      ],
    },
    node_identifier: "f4e756be5067cc974b13f08ef3e47aef298cb767807d97e320c46f2a815d6729",
    signature:
      "3141f41a558c06b35ac9605588c6dbe1e3c8cd8cde5fd8bf507df5fa0a202f88140043a924508c528c6d6015daebf4cb6088cca857c5582c69d25e3a65607b0a",
  },
};
