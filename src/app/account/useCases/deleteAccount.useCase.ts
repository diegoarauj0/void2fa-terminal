import { type IDeleteAccountUseCase } from "../contracts/useCases/deleteAccount.useCase.js";
import { type IAccountRepository } from "../contracts/repositories/account.repository.js";
import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteAccountUseCase implements IDeleteAccountUseCase {
  constructor(@inject("IAccountRepository") private accountRepository: IAccountRepository) {}

  public async deleteAccount(id: string): Promise<HotpAccountEntity | TotpAccountEntity> {
    const account = await this.accountRepository.findById(id);
    
    if (account === null) {
      throw "This account not found";
    }

    await this.accountRepository.delete(id);

    return account
  }
}
