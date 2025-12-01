import { findAccountByID, findAccountByName } from "@/utils/account.utils.js";
import { BaseCommand } from "../base.command.js";
import { logger } from "@/utils/logger.js";

export const findCommand = new BaseCommand({
  name: "find",
  arguments: ["<idorname>"],
  description: "Show detailed information about a specific account",
  examples: [
    {
      command: "find 323e2825-5b92-4bc9-8d3c-57ba2a2a7774",
      comment: "// Find an account by its ID",
    },
    {
      command: "find diegoarauj0",
      comment: "// Find an account by its name",
    },
    {
      command: "find --secret 323e2825-5b92-4bc9-8d3c-57ba2a2a7774",
      comment: "// Show account details including the secret (use with caution)",
    },
  ],
  options: [{ name: "-s, --secret", description: "Display the account’s secret and current code" }],
  action: async (idorname, options) => {
    const account = (await findAccountByID(idorname)) || (await findAccountByName(idorname));

    if (!account) {
      return console.error(logger.error("This account was not found"));
    }

    console.log(logger.account(account, options.secret));
  },
});
