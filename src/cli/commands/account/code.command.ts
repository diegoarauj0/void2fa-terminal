import { hotpAccountRepository, totpAccountRepository } from "@/repositories/index.js";
import { HotpAccountEntity, TotpAccountEntity } from "@/entities/index.js";
import {
  findAccountByID,
  findAccountByName,
  generateHotpCode,
  generateTotpCode,
  getTotpRemaining,
} from "@/utils/account.utils.js";
import { BaseCommand } from "../base.command.js";
import { setTimeout } from "timers/promises";
import { logger } from "@/utils/logger.js";
import clipboard from "clipboardy";

async function handleTotpAccount(account: TotpAccountEntity, options: any) {
  let remaining = getTotpRemaining(account.period);

  if (options.next) {
    console.log(logger.warning(`Waiting ${remaining} seconds for the next code...`));

    await setTimeout((remaining + 1) * 1000);

    const updated = await totpAccountRepository.findAccountByID(account.id);

    if (!updated || updated.type !== "TOTP") {
      return console.log(logger.error("This account was modified while waiting"));
    }

    account = updated;
  }

  const code = generateTotpCode(account);
  await clipboard.write(code || "");

  remaining = getTotpRemaining(account.period);

  return console.log(logger.success(`Code copied to clipboard. ${remaining} seconds until the next code`));
}

async function handleHotpAccount(account: HotpAccountEntity, options: any) {
  if (options.auto) {
    account.counter = account.counter + 1;
    await hotpAccountRepository.save(account);

    console.log(logger.warning(`Counter updated to: ${account.counter}`));
  }

  const code = generateHotpCode(account);
  await clipboard.write(code || "");

  return console.log(logger.success("Code copied to clipboard"));
}

export const codeCommand = new BaseCommand({
  name: "code",
  arguments: ["<idorname>"],
  description: "Copy TOTP/HOTP code to clipboard",
  examples: [
    {
      command: "code 323e2825-5b92-4bc9-8d3c-57ba2a2a7774",
      comment: "// Generates the TOTP/HOTP code for the account and copies it to the clipboard. (ID)",
    },
    {
      command: "code diegoarauj0",
      comment: "// Generates the TOTP/HOTP code for the account and copies it to the clipboard. (ID)",
    },
    {
      command: "code --next 323e2825-5b92-4bc9-8d3c-57ba2a2a7774",
      comment: "// Waits for the next TOTP cycle before generating and copying the code",
    },
    {
      command: "code --auto 323e2825-5b92-4bc9-8d3c-57ba2a2a7774",
      comment: "// Generates the HOTP code and automatically increments the counter",
    },
  ],
  options: [
    { name: "-n, --next", description: "Wait for the TOTP code to reset" },
    { name: "-a, --auto", description: "Auto-increment HOTP counter" },
  ],

  action: async (idorname, options) => {
    try {
      const account = (await findAccountByID(idorname)) || (await findAccountByName(idorname));

      if (!account) {
        return console.error(logger.error("This account was not found"));
      }

      if (account instanceof TotpAccountEntity) {
        return handleTotpAccount(account, options);
      }

      if (account instanceof HotpAccountEntity) {
        return handleHotpAccount(account, options);
      }

      throw new Error("Unknown account type");
    } catch (err) {
      return console.log(logger.error(`error: ${err}`));
    }
  },
});
