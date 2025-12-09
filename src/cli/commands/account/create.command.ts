import { accountRepository } from "@/repositories/account.repository.js";
import { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import { BaseCommand } from "@/cli/commands/common/base.command.js";
import { schemas } from "@/validators/account.validators.js";
import { NameVO } from "@/domain/VOs/account.vo.js";
import { logger } from "@/utils/logger.js";
import crypto from "crypto";
import Joi from "joi";

interface ICreateSchema {
  name: string;
  issuer: string;
  secret: string;
  algorithm?: "sha1" | "sha256" | "sha512";
  encoding?: "ascii" | "hex" | "base32" | "base64" | undefined;
  period?: number;
  digits?: number;
  counter?: number;
  type?: string;
}

const createSchema = Joi.object<ICreateSchema>({
  issuer: schemas.issuer.required(),
  secret: schemas.secret.required(),
  name: schemas.name.required(),
  algorithm: schemas.algorithm,
  encoding: schemas.encoding,
  counter: schemas.counter,
  period: schemas.period,
  digits: schemas.digits,
  type: schemas.type,
});

async function action(name: string, issuer: string, secret: string, options: any) {
  try {
    const data = await createSchema.validateAsync({ name, issuer, secret, ...options });

    if ((await accountRepository.findByName(new NameVO(name))) !== null) {
      return console.log(logger.error(`An account with the name "${data.name}" already exists`));
    }

    const id = crypto.randomUUID();

    let createdAccount;

    if (data.type === "HOTP") {
      createdAccount = await accountRepository.save(
        HotpAccountEntity.create({
          id: id,
          name: data.name,
          algorithm: data.algorithm || "sha1",
          encoding: data.encoding,
          counter: data.counter || 0,
          digits: data.digits || 6,
          issuer: data.issuer,
          secret: data.secret,
        }),
      );
    } else {
      createdAccount = await accountRepository.save(
        TotpAccountEntity.create({
          id: id,
          name: data.name,
          algorithm: data.algorithm || "sha1",
          encoding: data.encoding,
          period: data.period || 30,
          digits: data.digits || 6,
          issuer: data.issuer,
          secret: data.secret,
        }),
      );
    }

    console.log(logger.success(`Registered Account`));
    console.log(logger.account(createdAccount, false));

    return;
  } catch (err) {
    if (err instanceof Joi.ValidationError) {
      return console.log(logger.error(`error: ${err.message}`));
    }
    return console.log(logger.error(`error: ${err}`));
  }
}

export const createCommand = new BaseCommand({
  name: "create",
  arguments: ["<name>", "<issuer>", "<secret>"],
  description: "Register a new account for authentication",
  examples: [
    {
      command: "create @diegoarauj0 Github MRUWKZ3PMFZGC5LKGAQCAIBA",
      comment: "// Creates a TOTP account using default settings",
    },
    {
      command: "create --period 30 --type TOTP Github diegoarauj0 MRUWKZ3PMFZGC5LKGAQCAIBA",
      comment: "// Sets the type to TOTP and period to 30 seconds",
    },
  ],
  options: [
    { name: "-a, --algorithm <algorithm>", description: "Algorithm: sha1 (default), sha256, sha512" },
    { name: "-e, --encoding <encoding>", description: "Secret encoding: ascii, hex, base32, base64" },
    { name: "-p, --period <seconds>", description: "Time period for TOTP (default: 30)" },
    { name: "-d, --digits <count>", description: "Number of digits (default: 6)" },
    { name: "-c, --counter <value>", description: "Initial counter (for HOTP, default: 0)" },
    { name: "-t, --type <type>", description: "Account type: TOTP (default) or HOTP" },
  ],
  action,
});
