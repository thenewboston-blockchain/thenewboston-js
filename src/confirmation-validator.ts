import { Validator } from "./validator";
import type { Account } from "./account";
import type {
  BankConfirmationServices,
  ConfirmationValidatorConfigResponse,
  CleanResponse,
  CrawlResponse,
  CleanData,
  CrawlData,
  PaginationOptions,
} from "./models";

/** Used for connecting with and using confirmation validator server nodes. */
export class ConfirmationValidator extends Validator {
  /** Gets the current confirmation confirmation validator's listed services. */
  async getBankConfirmationServices(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData("/bank_confirmation_services", options);
  }

  /** Gets the current crawl status */
  async getCrawlStatus() {
    return await super.getData<CrawlResponse>("/crawl");
  }

  /**
   * Sends a Post Request to the confirmation validator to start crawl process
   * @param account An Account created with the Network Id Signing key of the current Confirmation Validator
   */
  async startCrawl(account: Account) {
    return await super.postData<CrawlResponse>(
      "/crawl",
      account.createSignedMessage<CrawlData>({ crawl: "start" })
    );
  }

  /**
   * Sends a Post Request to the confirmation validator to start crawl process
   * @param account An Account created with the Network Id Signing key of the current Confirmation Validator
   */
  async stopCrawl(account: Account) {
    return await super.postData<CrawlResponse>(
      "/crawl",
      account.createSignedMessage<CrawlData>({ crawl: "stop" })
    );
  }

  /** Gets the current clean status */
  async getCleanStatus() {
    return await super.getData<CleanResponse>("/clean");
  }

  /**
   * Sends a Post Request to the confirmation validator to start clean process
   * @param account An Account created with the Network Id Signing key of the current Confirmation Validator
   */
  async startClean(account: Account) {
    return await super.postData<CleanResponse>(
      "/clean",
      account.createSignedMessage<CleanData>({ clean: "start" })
    );
  }

  /**
   * Sends a Post Request to the confirmation validator to start clean process
   * @param account An Account created with the Network Id Signing key of the current Confirmation Validator
   */
  async stopClean(account: Account) {
    return await super.postData<CleanResponse>(
      "/clean",
      account.createSignedMessage<CleanData>({ clean: "stop" })
    );
  }

  // TODO: POST /confirmation_blocks

  /**
   * Sends a notification to the bank that a primary validator has left the network.
   * @param ipAddress the ip address of the primary validator that is leaving
   * @param port the port that the primary validator is on
   * @param protocol the protocol of the primary validator
   * @param account the account that the current `ConfirmationValidator` is connected to
   */
  async sendPrimaryValidatorUpdatedPing(ipAddress: string, port: number, protocol: string, account: Account) {
    return await super.postData(
      "/primary_validator_updated",
      account.createSignedMessage({ ip_address: ipAddress, port, protocol })
    );
  }

  /**
   * Sends a signed POST request to the confirmation validator for an upgrade request.
   * @param nodeIdentifier the node identifier of the confirmation validator that is receiving the upgrade notice
   * @param account the current confirmation validator server's account
   */
  async sendUpgradeRequest(nodeIdentifier: string, account: Account) {
    return await super.postData(
      "/upgrade_request",
      account.createSignedMessage({ validator_node_identifier: nodeIdentifier })
    );
  }

  /** Gets the current confirmation validator's config data. */
  async getConfig() {
    return super._getConfig<ConfirmationValidatorConfigResponse>();
  }
}
