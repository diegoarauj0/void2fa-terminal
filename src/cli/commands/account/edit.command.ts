import { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import { accountRepository } from "@/repositories/account.repository.js";
import { BaseCommand } from "@/cli/commands/common/base.command.js";
import { schemas } from "@/validators/account.validators.js";
import { findByIdOrName } from "@/utils/findByIdOrName.js";
import * as VOs from "@/domain/VOs/account.vo.js";
import { logger } from "@/utils/logger.js";
import Joi from "joi";

const editSchema = Joi.object({
  name: schemas.name,
  issuer: schemas.issuer,
  secret: schemas.secret,
  algorithm: schemas.algorithm,
  encoding: schemas.encoding,
  period: schemas.period,
  digits: schemas.digits,
  counter: schemas.counter,
});

async function action(idorname: string, options: any) {
  try {
    const data = await editSchema.validateAsync({ ...options });

    const account = await findByIdOrName(idorname);

    if (!account) {
      return console.error(logger.error("This account was not found"));
    }

    account.name = data.name === undefined ? account.name : new VOs.NameVO(data.name);
    account.issuer = data.issuer === undefined ? account.issuer : new VOs.IssuerVO(data.issuer);
    account.secret = data.secret === undefined ? account.secret : new VOs.SecretVO(data.secret);
    account.algorithm =
      data.algorithm === undefined ? account.algorithm : new VOs.AlgorithmVO(data.algorithm);
    account.encoding = data.encoding === undefined ? account.encoding : new VOs.EncodingVO(data.encoding);
    account.digits = data.digits === undefined ? account.digits : new VOs.DigitsVO(data.digits);

    if (account instanceof HotpAccountEntity) {
      account.counter = data.counter === undefined ? account.counter : new VOs.CounterVO(data.counter);
    } else {
      account.period = data.period === undefined ? account.period : new VOs.PeriodVO(data.period);
    }

    await accountRepository.save(account)

    console.log("Account updated successfully!");
  } catch (err) {
    return console.log(logger.error(`error: ${err}`));
  }
}

export const editCommand = new BaseCommand({
  arguments: ["<idorname>"],
  name: "edit",
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
  action,
});
