const { createAccount } = require("./dist");

async function main() {
  const account = createAccount();
  console.log(account);
}

main();
