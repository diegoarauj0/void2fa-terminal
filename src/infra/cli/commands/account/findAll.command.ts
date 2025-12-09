import { findAllAccounts } from "@/utils/account.utils.js";
import { BaseCommand } from "../base.command.js";
import { logger } from "@/utils/logger.js";

export const findAllCommand = new BaseCommand({
  name: "find-all",
  description: "List all saved accounts",
  examples: [
    { command: "find-all", comment: "// Display each account’s" },
    { command: "find-all --secret", comment: "// Display each account’s secret and code" },
  ],
  options: [{ name: "-s, --secret", description: "Display each account’s secret and current code" }],
  action: async (options) => {
    const accounts = await findAllAccounts();

    console.log(logger.success(`${accounts.length} saved accounts`));

    accounts.forEach((account, index) => {
      console.log(logger.account(account, options.secret));
    });
  },
});
