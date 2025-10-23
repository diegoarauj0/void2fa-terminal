import { type IDeleteAccountUseCase } from "../contracts/useCases/deleteAccount.useCase.js";
import { type IAccountRepository } from "../contracts/repositories/account.repository.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteAccountUseCase implements IDeleteAccountUseCase {
  constructor(@inject("IAccountRepository") private accountRepository: IAccountRepository) {}

  public async deleteAccount(id: string): Promise<void> {
    const account = await this.accountRepository.findById(id);

    if (account) {
      throw "This account not found";
    }

    await this.accountRepository.delete(id);
  }
}
