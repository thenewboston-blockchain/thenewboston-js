const { Account } = require("../dist");

describe("Account", () => {
  const testAccountData = {
    accountNumber: "0fa2596d9fada397a6668463fed71c8c7260a411d108da6480d65121d443cc58",
    signingKey: "61647c0dd309646ea5b3868c8c237158483a10484b0485663e4f82a68a10535e",
  };

  it("constructor()", () => {
    const account = new Account();
    expect(account.publicKey).toHaveLength(32);
    expect(account.signingKey).toHaveLength(64);
    expect(account.publicKeyHex).toHaveLength(64);
    expect(account.signingKeyHex).toHaveLength(64);
  });

  it("constructor(signingKey)", () => {
    const account = new Account(testAccountData.signingKey);
    expect(account.publicKeyHex).toBe(testAccountData.accountNumber);
    expect(account.signingKeyHex).toBe(testAccountData.signingKey);
  });

  // TODO: constructor(signingKeyUint8Array)

  // TODO: constructor(signingKeyUint8Array, publicKeyUint8Array)

  it("publicKeyHex", () => {
    const { publicKeyHex } = new Account();
    expect(publicKeyHex).toHaveLength(64);
  });

  it("signingKeyHex", () => {
    const { signingKeyHex } = new Account();
    expect(signingKeyHex).toHaveLength(64);
  });

  it("createSignature(message)", () => {
    const account = new Account(testAccountData.signingKey);
    expect(account.createSignature("Hello, world!")).toBe(
      "a9f87d87b43d75f54519d0663d98807588b4d9dbcda12a47e56b6b8d34359a9adafb09a207eb05512d8abcabde658dae1aa542a12f79f759cb00575ff579a60e"
    );
    expect(account.createSignature("Bucky is amazing!")).toBe(
      "4b17a33a511c2f208a18b68385669acde62a752faad2fa4caeba57562353534690bdc7249bc225af5ef3a4150581a2bd5cdf2f203a17f5d5e4ad0aee5a0fca0c"
    );
  });

  // TODO: createSignedData(data)

  it("createSignedMessage(data)", () => {
    const account = new Account(testAccountData.signingKey);
    const message = account.createSignedMessage({ name: "carter", description: "is awesome" });
    expect(message.data.name).toBe("carter");
    expect(message.data.description).toBe("is awesome");
    expect(message.node_identifier).toBe(testAccountData.accountNumber);
    expect(message.signature).toBe(
      "77c9e6a1e0dea9a40414a565841db27e694db6be1f065c8aac35d0b2aa6edb3578cbbcc9cf38565d115fff73f1e3b491078940fcf2e4c4df286642a01d20e60c"
    );
  });

  // TODO: createBlockData(balanceLock, transactions)

  // TODO: createBlockMessage(balanceLock, transactions)
});
