import { totpAccountRepository, hotpAccountRepository } from "@/repositories/index.js";
import { findAccountByID, findAccountByName } from "@/utils/account.utils.js";
import { HotpAccountEntity } from "@/entities/hotpAccount.entity.js";
import { BaseCommand } from "../base.command.js";
import { logger } from "@/utils/logger.js";

export const deleteCommand = new BaseCommand({
  name: "delete",
  arguments: ["<idorname>"],
  description: "Delete a saved account",
  examples: [
    { command: "delete 323e2825-5b92-4bc9-8d3c-57ba2a2a7774", comment: "Deletes an account using its ID" },
    { command: "delete diegoarauj0", comment: "Deletes an account using its name" },
  ],
  action: async (idorname) => {
    try {
      const account = (await findAccountByID(idorname)) || (await findAccountByName(idorname));

      if (!account) {
        return console.error(logger.error("This account was not found"));
      }

      if (account instanceof HotpAccountEntity) {
        await hotpAccountRepository.delete(account);
      } else {
        await totpAccountRepository.delete(account);
      }

      console.log(
        logger.success(
          `🗑️ Account deleted successfully\n Name: ${account.name}\n Issuer: ${account.issuer}\n ID: ${account.id}`,
        ),
      );
    } catch (err) {
      return console.log(logger.error(`error: ${err}`));
    }
  },
});
