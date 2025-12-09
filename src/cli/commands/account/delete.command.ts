import { accountRepository } from "@/repositories/account.repository.js";
import { BaseCommand } from "@/cli/commands/common/base.command.js";
import { findByIdOrName } from "@/utils/findByIdOrName.js";
import { logger } from "@/utils/logger.js";

async function action(idorname: string) {
  try {
    const account = await findByIdOrName(idorname);

    if (!account) {
      return console.error(logger.error("This account was not found"));
    }

    accountRepository.delete(account);

    console.log(
      logger.success(
        `Account deleted successfully\n Name: ${account.name.toValue()}\n Issuer: ${account.issuer.toValue()}\n ID: ${account.id.toValue()}`,
      ),
    );
  } catch (err) {
    return console.log(logger.error(`error: ${err}`));
  }
}

export const deleteCommand = new BaseCommand({
  description: "Delete a saved account",
  arguments: ["<idorname>"],
  name: "delete",
  examples: [
    { command: "delete 323e2825-5b92-4bc9-8d3c-57ba2a2a7774", comment: "Deletes an account using its ID" },
    { command: "delete diegoarauj0", comment: "Deletes an account using its name" },
  ],
  action,
});
