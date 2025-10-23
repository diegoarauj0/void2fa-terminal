import { type IEditAccountDTO, type IEditAccountUseCase } from "../contracts/useCases/editAccount.useCase.js";
import type { IAccountRepository } from "../contracts/repositories/account.repository.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class EditAccountUseCase implements IEditAccountUseCase {
  constructor(@inject("IAccountRepository") private accountRepository: IAccountRepository) {}

  public async editAccount(data: IEditAccountDTO): Promise<void> {
    const account = await this.accountRepository.findById(data.account.id);

    if (account === null) {
      throw "This account not found";
    }

    await this.accountRepository.save({ ...account, ...data });

  }
}
