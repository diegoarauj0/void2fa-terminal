import { totpAccountRepository, hotpAccountRepository } from "@/repositories/index.js";
import { detectEncoding, findAccountByName } from "@/utils/account.utils.js";
import { TotpAccountEntity, HotpAccountEntity } from "@/domain/entities/index.js";
import * as schema from "@/infra/validators/account.validators.js";
import { BaseCommand } from "../base.command.js";
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
  name: schema.accountName.required(),
  issuer: schema.accountIssuer.required(),
  secret: schema.accountSecret.required(),
  algorithm: schema.accountAlgorithm,
  encoding: schema.accountEncoding,
  period: schema.accountPeriod,
  digits: schema.accountDigits,
  counter: schema.accountCounter,
  type: schema.accountType,
});

function createHotpAccountEntity(id: string, data: ICreateSchema): HotpAccountEntity {
  return new HotpAccountEntity(
    id,
    data.secret,
    data.counter || 0,
    data.digits || 6,
    data.algorithm || "sha1",
    data.issuer,
    data.name,
    data.encoding || detectEncoding(data.secret),
  );
}

function createTotpAccountEntity(id: string, data: ICreateSchema): TotpAccountEntity {
  return new TotpAccountEntity(
    id,
    data.secret,
    data.period || 30,
    data.digits || 6,
    data.algorithm || "sha1",
    data.issuer,
    data.name,
    data.encoding || detectEncoding(data.secret),
  );
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
  action: async (name, issuer, secret, options) => {
    try {
      const data = await createSchema.validateAsync({ name, issuer, secret, ...options });

      if ((await findAccountByName(name)) !== null) {
        return console.log(logger.error(`An account with the name "${data.name}" already exists`));
      }

      const id = crypto.randomUUID();

      let createdAccount;

      if (data.type === "HOTP") {
        createdAccount = createHotpAccountEntity(id, data);
        await hotpAccountRepository.save(createdAccount);
      } else {
        createdAccount = createTotpAccountEntity(id, data);
        await totpAccountRepository.save(createdAccount);
      }

      console.log(logger.success(`Registered Account`));
      console.log(logger.account(createdAccount, false));
    } catch (err) {
      if (err instanceof Joi.ValidationError) {
        return console.log(logger.error(`error: ${err.message}`));
      }
      return console.log(logger.error(`error: ${err}`));
    }
  },
});
