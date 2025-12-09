import { BaseCommand } from "@/cli/commands/common/base.command.js";
import { findByIdOrName } from "@/utils/findByIdOrName.js";
import { logger } from "@/utils/logger.js";

async function action(idorname: string, options: { secret: boolean }) {
  try {
    const account = await findByIdOrName(idorname);

    if (!account) {
      return console.error(logger.error("This account was not found"));
    }

    console.log(logger.account(account, options.secret));
  } catch (err) {
    return console.log(logger.error(`error: ${err}`));
  }
}

export const findCommand = new BaseCommand({
  options: [{ name: "-s, --secret", description: "Display the account’s secret and current code" }],
  description: "Show detailed information about a specific account",
  arguments: ["<idorname>"],
  name: "find",
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

  action,
});
