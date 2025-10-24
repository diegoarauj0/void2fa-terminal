import type { IEditAccountUseCase } from "@app/account/contracts/useCases/editAccount.useCase.js";
import * as schema from "validators/account.validators.js";
import { inject, injectable } from "tsyringe";
import chalk from "chalk";
import Joi from "joi";

@injectable()
export class EditAccountController {
  private editAccountSchema = Joi.object({
    id: schema.accountIdSchema,
    name: schema.accountNameSchema,
    issuer: schema.accountIssuerSchema,
    secret: schema.accountSecretSchema,
    counter: schema.accountCounterSchema,
    digits: schema.accountDigitsSchema,
    period: schema.accountPeriodSchema,
    encoding: schema.accountEncodingSchema,
    algorithm: schema.accountAlgorithmSchema,
  });

  constructor(@inject("IEditAccountUseCase") private editAccountUseCase: IEditAccountUseCase) {}

  public async editAccount(data: { account: any }): Promise<void> {
    try {
      const result = await this.editAccountSchema.validateAsync(data.account);

      const accountPayload: any = {
        id: result.id,
        name: result.name,
        issuer: result.issuer,
        secret: result.secret,
      };

      accountPayload.algorithm = result.algorithm;
      accountPayload.counter = result.counter;
      accountPayload.digits = result.digits;
      accountPayload.period = result.period;
      accountPayload.encoding = result.encoding;

      const account = await this.editAccountUseCase.editAccount({
        account: accountPayload,
      });

      console.log(
        chalk.green(
          `Edited account\n Name: ${account.name}\n Issuer: ${account.issuer}\n ID: ${account.id}\n`,
        ),
      );
    } catch (err) {
      if (err instanceof Joi.ValidationError) {
        return console.log(chalk.red(`error: ${err.message}`));
      }

      console.log(chalk.red(`error: ${err}`));
    }
  }
}
