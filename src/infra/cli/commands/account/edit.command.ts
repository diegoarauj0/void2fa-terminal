import { totpAccountRepository, hotpAccountRepository } from "@/repositories/index.js";
import { findAccountByID, findAccountByName } from "@/utils/account.utils.js";
import { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import * as schema from "@/infra/validators/account.validators.js";
import { BaseCommand } from "../base.command.js";
import { logger } from "@/utils/logger.js";
import Joi from "joi";

interface IEditSchema {
  name?: string;
  issuer?: string;
  secret?: string;
  algorithm?: "sha1" | "sha256" | "sha512";
  encoding?: "ascii" | "hex" | "base32" | "base64" | undefined;
  period?: number;
  digits?: number;
  counter?: number;
}

const editSchema = Joi.object<IEditSchema>({
  name: schema.accountName,
  issuer: schema.accountIssuer,
  secret: schema.accountSecret,
  algorithm: schema.accountAlgorithm,
  encoding: schema.accountEncoding,
  period: schema.accountPeriod,
  digits: schema.accountDigits,
  counter: schema.accountCounter,
});

export const editCommand = new BaseCommand({
  name: "edit",
  arguments: ["<idorname>"],
  description:
    "Edit a saved account. (Note: The ONLY field that cannot be changed is the account type (HOTP/TOTP).)",
  examples: [
    {
      command: "edit -n negativo diegoarauj0",
      comment: "// Change name diegoarauj0 to negativo_ddz",
    },
    {
      command: "edit -i Gitlab diegoarauj0",
      comment: "// Change issuer GitHub to Gitlab",
    },
    {
      command: "edit -i Gitlab -n negativo 323e2825-5b92-4bc9-8d3c-57ba2a2a7774",
      comment: "// Change issuer GitHub to Gitlab and diegoarauj0 to negativo.",
    },
  ],
  options: [
    { name: "-n, --name <name>", description: "Name" },
    { name: "-i, --issuer <issuer>", description: "Issuer" },
    { name: "-s, --secret <secret>", description: "Secret" },
    { name: "-a, --algorithm <algorithm>", description: "Algorithm: sha1, sha256, sha512" },
    { name: "-e, --encoding <encoding>", description: "Encoding: ascii, hex, base32, base64" },
    { name: "-p, --period <seconds>", description: "TOTP period" },
    { name: "-d, --digits <count>", description: "Digits" },
    { name: "-c, --counter <value>", description: "Initial counter (for HOTP)" },
  ],
  action: async (idorname, options) => {
    const data = await editSchema.validateAsync({ ...options });

    const account = (await findAccountByID(idorname)) || (await findAccountByName(idorname));

    if (!account) {
      return console.error(logger.error("This account was not found"));
    }

    account.name = data.name ?? account.name;
    account.issuer = data.issuer ?? account.issuer;
    account.secret = data.secret ?? account.secret;
    account.algorithm = data.algorithm ?? account.algorithm;
    account.encoding = data.encoding ?? account.encoding;
    account.digits = data.digits ?? account.digits;

    if (account instanceof HotpAccountEntity) {
      account.counter = data.counter ?? account.counter;

      await hotpAccountRepository.save(account);
    } else {
      account.period = data.period ?? account.period;

      await totpAccountRepository.save(account);
    }

    console.log("Account updated successfully!");
  },
});
