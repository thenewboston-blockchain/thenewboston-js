# Confirmation Validators

In this section, we will look at the methods of the Primary Validator class, which extends the Validator class.

> It is recommended that you read the [documentation for the `Validator` Class](#Validator) Class first, to understand the base methods before reading this section.

## Get Bank Confirmation Services

Confirmation Services are services rendered by a CV for validating a Bank's transactions

We can see what Banks are currently using a Confirmation Validators services and the details attached by using the `getBankConfirmationServices()` method

```ts
const CV = new tnb.ConfirmationValidator("http://54.177.174.219");

// retrive confirmation services handled by CV
const paginationOptions = { limit: 2, offset: 0 };
const confirmationServices = await CV.getBankConfirmationServices(paginationOptions);

console.log(confirmationServices);

/*
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "120a1b5d-8978-4fa5-a5dc-66dbe8ddbd75",
      "created_date": "2020-11-29T19:29:12.656665Z",
      "modified_date": "2020-11-29T19:29:12.656704Z",
      "end": "2020-11-30T19:28:36Z",
      "start": "2020-11-29T19:29:10Z",
      "bank": "c6ad67ee-d9b8-4c8f-ba62-f46213119689"
    },
    {
      "id": "cc56651f-b4e9-487d-82b9-64774a11a4e5",
      "created_date": "2020-11-29T19:30:21.485785Z",
      "modified_date": "2020-11-29T19:30:21.485832Z",
      "end": "2020-12-02T19:30:16Z",
      "start": "2020-11-29T19:30:18Z",
      "bank": "c6ad67ee-d9b8-4c8f-ba62-f46213119689"
    }
  ]
}*/
```

## Send Primary Validator Updated Ping

The CV sends a notice back to the bank that indicates that they are leaving the current network and switching to a new PV (a new network)

The Primary Validator Updated Notice can be sent using the `sendPrimaryValidatorUpdatedPing()` method

```ts
const CV = new tnb.ConfirmationValidator("http://54.177.174.219");

//Ip address of leaving PV
const ipAddress: "54.193.31.159";
const port: "80";
const protocol = "http";

//Account of CV
const account = new  tnb.Account(CV.getConfig().account_number, "fakeSigningKeyHex");

cont response = await CV.sendPrimaryValidatorUpdatedPing(ipAddress, port, protocol,  account);

console.log(response);

// Status Code 200 if the CV followed the bank and synced to the new primary validator (new network)
// Status Code 400 if the CV does not follow bank and remains on current network

// No Response

```

## Send Upgrade Request

A Request sent to Confirmation Validator requesting one of them to upgrade to a Primary Validator

The Upgrade Request can be sent using the `sendUpgradeRequest()` method

```ts
const CV = new tnb.ConfirmationValidator("http://54.177.174.219");

//the node identifier of the confirmation validator that is receiving the upgrade notice
const nodeIdentifier = "9bfa37627e2dba0ae48165b219e76ceaba036b3db8e84108af73a1cce01fad35";

//Account of current CV
const account = new tnb.Account(CV.getConfig().account_number, "fakeSigningKeyHex");

const response = await CV.sendUpgradeRequest(nodeIdentifier, account);

console.log(response);

// Status Code 200 if the CV Accepted the request and upgraded to a Primary Validator
// Status Code 400 if the CV Rejected the request

/*
{
  "primary_validator": {
    "account_number": "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c",
    "ip_address": "54.177.174.219",
    "node_identifier": "2262026a562b0274163158e92e8fbc4d28e519bc5ba8c1cf403703292be84a51",
    "port": 80,
    "protocol": "http",
    "version": "v1.0",
    "default_transaction_fee": 1,
    "root_account_file": "http://54.177.174.219/media/root_account_file.json",
    "root_account_file_hash": "cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d",
    "seed_block_identifier": "",
    "daily_confirmation_rate": null,
    "trust": 100.0
  },
  "account_number": "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c",
  "ip_address": "54.177.174.219",
  "node_identifier": "2262026a562b0274163158e92e8fbc4d28e519bc5ba8c1cf403703292be84a51",
  "port": 80,
  "protocol": "http",
  "version": "v1.0",
  "default_transaction_fee": 1,
  "root_account_file": "http://54.177.174.219/media/root_account_file.json",
  "root_account_file_hash": "cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d",
  "seed_block_identifier": "",
  "daily_confirmation_rate": null,
  "node_type": "PRIMARY_VALIDATOR"
}
*/
```

## Crawl

A network crawl is the process of browsing nodes in order to discover new one. A crawl can be triggered by any client, given that it knows the Node's signing key.

### Retrieve Crawl Status

To retrieve the current crawl status of the bank we can use the `getCrawlStatus()` method

```ts
const crawlStatus = CV.getCrawlStatus();

console.log(crawlStatus);

//  {
//   crawl_last_completed: '2021-03-29 14:07:26.218216+00:00',
//   crawl_status: 'crawling',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

### Start Crawl

To initiate a network crawl we need to send a request to the bank using the `startCrawl()` method

```ts
const account = new Account("CV_NetworkIdSigningKey");

const response = CV.startCrawl(account);

console.log(response);

//  {
//   crawl_last_completed: '2021-03-29 14:07:26.218216+00:00',
//   crawl_status: 'crawling',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

### Stopping Crawl

To stop the network crawl process we can send a request to the bank using the `stopCrawl()` method

```ts
const account = new Account("CV_NetworkIdSigningKey");

const response = CV.stopCrawl(account);

console.log(response);

// {
//   crawl_last_completed: '2021-03-29 14:20:29.265859+00:00',
//   crawl_status: 'stop_requested',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

## Clean

A network clean is the process of updating the network (mainly to remove disconected nodes). A clean can be triggered by any client, given that it knows the Node's signing key.

### Retrieve Clean Status

To retrieve the current clean status of the bank we can use the `getCleanStatus()` method

```ts
const cleanStatus = CV.getCleanStatus();

console.log(cleanStatus);

//  {
//   clean_last_completed: '2021-03-29 14:07:26.218216+00:00',
//   clean_status: 'cleaning',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

### Start Clean

To initiate a network clean we need to send a request to the bank using the `startClean()` method

```ts
const account = new Account("CV_NetworkIdSigningKey");

const response = CV.startClean(account);

console.log(response);

//  {
//   clean_last_completed: '2021-03-29 14:07:26.218216+00:00',
//   clean_status: 'cleaning',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

### Stopping Clean

To stop the network clean process we can send a request to the bank using the `stopClean()` method

```ts
const account = new Account("CV_NetworkIdSigningKey");

const response = CV.stopClean(account);

console.log(response);

// {
//   clean_last_completed: '2021-03-29 14:20:29.265859+00:00',
//   clean_status: 'stop_requested',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```
