import type { IDeleteAccountUseCase } from "@app/account/contracts/useCases/deleteAccount.useCase.js";
import { accountIdSchema } from "validators/account.validators.js";
import { inject, injectable } from "tsyringe";
import chalk from "chalk";
import Joi from "joi";

@injectable()
export class DeleteAccountController {
  private deleteAccountSchema = Joi.object({
    id: accountIdSchema.required(),
  });

  constructor(@inject("IDeleteAccountUseCase") private deleteAccountUseCase: IDeleteAccountUseCase) {}

  public async deleteAccount(_id: string): Promise<void> {
    try {
      const result = await this.deleteAccountSchema.validateAsync({ id: _id });

      const account = await this.deleteAccountUseCase.deleteAccount(result.id);

      console.log(
        chalk.green(
          `Account deleted\n Name: ${account.name}\n Issuer: ${account.issuer}\n ID: ${account.id}\n`,
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
