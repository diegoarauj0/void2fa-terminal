import { accountRepository } from "@/repositories/account.repository.js";
import { BaseCommand } from "@/cli/commands/common/base.command.js";
import { logger } from "@/utils/logger.js";

async function action(options: { secret: boolean }) {
  try {
    const accounts = await accountRepository.findAll();

    console.log(logger.success(`${accounts.length} saved accounts`));

    accounts.forEach((account) => console.log(logger.account(account, options.secret)));
  } catch (err) {
    return console.log(logger.error(`error: ${err}`));
  }
}

export const findAllCommand = new BaseCommand({
  options: [{ name: "-s, --secret", description: "Display each account’s secret and current code" }],
  description: "List all saved accounts",
  name: "find-all",
  examples: [
    { command: "find-all", comment: "// Display each account’s" },
    { command: "find-all --secret", comment: "// Display each account’s secret and code" },
  ],
  action,
});
