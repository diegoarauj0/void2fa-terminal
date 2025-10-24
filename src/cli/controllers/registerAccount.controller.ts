import type { IRegisterAccountUseCase } from "@app/account/contracts/useCases/registerAccount.useCase.js";
import * as schema from "validators/account.validators.js";
import { inject, injectable } from "tsyringe";
import chalk from "chalk";
import Joi from "joi";

@injectable()
export class RegisterAccountController {
  private registerAccountSchema = Joi.object({
    name: schema.accountNameSchema.required(),
    issuer: schema.accountIssuerSchema.required(),
    secret: schema.accountSecretSchema.required(),
    id: schema.accountIdSchema,
    type: schema.accountTypeSchema,
    counter: schema.accountCounterSchema,
    digits: schema.accountDigitsSchema,
    period: schema.accountPeriodSchema,
    encoding: schema.accountEncodingSchema,
    algorithm: schema.accountAlgorithmSchema,
  });

  constructor(@inject("IRegisterAccountUseCase") private registerAccountUseCase: IRegisterAccountUseCase) {}

  public async registerAccount(data: { account: any }): Promise<void> {
    try {
      const result = await this.registerAccountSchema.validateAsync(data.account);

      const account = await this.registerAccountUseCase.registerAccount({
        account: {
          id: result.id,
          name: result.name,
          issuer: result.issuer,
          secret: result.secret,
          type: result.type || "TOTP",
          algorithm: result.algorithm || "sha1",
          counter: result.counter || 0,
          digits: result.digits || 6,
          period: result.period || 30,
          encoding: result.encoding || undefined,
        },
      });

      console.log(
        chalk.green(
          `Registered Account\n Name: ${account.name}\n Issuer: ${account.issuer}\n ID: ${account.id}\n`,
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
