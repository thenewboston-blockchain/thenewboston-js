const { Account } = require("../dist");

describe("Account", () => {
  const defaultAccount = {
    accountNumber: "0fa2596d9fada397a6668463fed71c8c7260a411d108da6480d65121d443cc58",
    signingKey: "61647c0dd309646ea5b3868c8c237158483a10484b0485663e4f82a68a10535e",
  };

  function createDefaultAccount() {
    return new Account(defaultAccount.signingKey, defaultAccount.accountNumber);
  }

  function assertAccountBasics(account) {
    expect(account.accountNumberHex).toHaveLength(64);
    expect(account.signingKeyHex).toHaveLength(64);
  }

  function assertAccountBasicValues(account, signingKeyHex, accountNumberHex) {
    expect(account.signingKeyHex).toBe(signingKeyHex);
    if (accountNumberHex !== undefined) {
      expect(account.accountNumberHex).toBe(accountNumberHex);
    }
  }

  it("constructor()", () => {
    const account = new Account();
    assertAccountBasics(account);
  });

  it("constructor(signingKey)", () => {
    const account = new Account(defaultAccount.signingKey);
    assertAccountBasics(account);
    assertAccountBasicValues(account, defaultAccount.signingKey, defaultAccount.accountNumber);
  });

  it("constructor(signingKey, accountNumber)", () => {
    const account = new Account(defaultAccount.signingKey, defaultAccount.accountNumber);
    assertAccountBasics(account);
    assertAccountBasicValues(account, defaultAccount.signingKey, defaultAccount.accountNumber);
  });

  it("isValidPair(signingKey, accountNumber)", () => {
    expect(Account.isValidPair(defaultAccount.signingKey, defaultAccount.accountNumber)).toBeTruthy();
    expect(Account.isValidPair(defaultAccount.accountNumber, defaultAccount.accountNumber)).toBeFalsy();
    expect(Account.isValidPair(defaultAccount.signingKey, defaultAccount.signingKey)).toBeFalsy();
    expect(Account.isValidPair(defaultAccount.accountNumber, defaultAccount.signingKey)).toBeFalsy();
  });

  it("isValidPair doesn't throw errors", () => {
    const results = [
      Account.isValidPair("asdf", "asdf"),
      Account.isValidPair(defaultAccount.signingKey, "asdf"),
      Account.isValidPair("asdf", defaultAccount.accountNumber),
    ];
    expect(results.every((val) => typeof val === "boolean")).toBeTruthy();
  });

  it("createSignature(message)", () => {
    const account = createDefaultAccount();
    assertAccountBasics(account);
    assertAccountBasicValues(account, defaultAccount.signingKey, defaultAccount.accountNumber);
    const signature = account.createSignature("asdfasdfasdfasdfasdfasdfasdfasdfasdf");
    expect(signature).toBe(
      "dea6ad327c3a6e2cd3e96144f2b5f88a8f272d8849ec9898cd44cded6e54e72bf7c8d8a23e316c089da4b24b81e6958d7461c01902b03c64525054a73ccc1b0f"
    );
  });

  it("createSignedMessage(data)", () => {
    const account = createDefaultAccount();
    assertAccountBasics(account);
    assertAccountBasicValues(account, defaultAccount.signingKey, defaultAccount.accountNumber);
    const message = account.createSignedMessage({ trust: "26.90" });
    expect(message).toStrictEqual({
      message: {
        trust: "26.90",
      },
      node_identifier: defaultAccount.accountNumber,
      signature:
        "ef8b77533ec7075e0174f8febf9f8836344c0d5c1ce0b3a0616edab4d9a5c026aa582449a6f3beabb2ab50961c233ae74916dd4dca1f7a48a361747f48751600",
    });
  });

  // TODO: createBlockData

  // TODO: createBlockMessage
});
