import { accountRepository } from "@/repositories/account.repository.js";
import { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import { BaseCommand } from "@/cli/commands/common/base.command.js";
import { findByIdOrName } from "@/utils/findByIdOrName.js";
import { otpService } from "@/services/otp.service.js";
import { setTimeout } from "timers/promises";
import { logger } from "@/utils/logger.js";
import clipboard from "clipboardy";

async function handleTotpAccount(account: TotpAccountEntity, options: any) {
  let remaining = otpService.getTotpRemaining(account);

  if (options.next) {
    console.log(logger.warning(`Waiting ${remaining} seconds for the next code...`));

    await setTimeout((remaining + 1) * 1000);

    const updated = await accountRepository.findById(account.id);

    if (!updated) {
      return console.log(logger.error("This account was modified while waiting"));
    }
  }

  const code = otpService.generateTotpCode(account);
  await clipboard.write(code || "");

  remaining = otpService.getTotpRemaining(account);

  return console.log(logger.success(`Code copied to clipboard. ${remaining} seconds until the next code`));
}

async function handleHotpAccount(account: HotpAccountEntity, options: any) {
  if (options.auto) {
    account.addCounter();

    await accountRepository.save(account);

    console.log(logger.warning(`Counter updated to: ${account.counter}`));
  }

  const code = otpService.generateHotpCode(account);
  await clipboard.write(code || "");

  return console.log(logger.success("Code copied to clipboard"));
}

async function action(idorname: string, options: { secret: boolean }) {
  try {
    const account = await findByIdOrName(idorname);

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
}

export const codeCommand = new BaseCommand({
  description: "Copy TOTP/HOTP code to clipboard",
  arguments: ["<idorname>"],
  name: "code",
  options: [
    { name: "-n, --next", description: "Wait for the TOTP code to reset" },
    { name: "-a, --auto", description: "Auto-increment HOTP counter" },
  ],
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
  action,
});
