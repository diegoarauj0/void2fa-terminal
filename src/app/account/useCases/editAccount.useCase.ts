import { type IEditAccountDTO, type IEditAccountUseCase } from "../contracts/useCases/editAccount.useCase.js";
import type { IAccountRepository } from "../contracts/repositories/account.repository.js";
import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class EditAccountUseCase implements IEditAccountUseCase {
  constructor(@inject("IAccountRepository") private accountRepository: IAccountRepository) {}

  public async editAccount(data: IEditAccountDTO): Promise<HotpAccountEntity | TotpAccountEntity> {
    const account = await this.accountRepository.findById(data.account.id);

    if (account === null) {
      throw "This account not found";
    }

    return await this.accountRepository.save({ ...account, ...JSON.parse(JSON.stringify(data.account)) });
  }
}
