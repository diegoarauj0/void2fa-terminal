import type {
  IRegisterAccountDTO,
  IRegisterAccountUseCase,
} from "../contracts/useCases/registerAccount.useCase.js";
import type { IAccountRepository } from "../contracts/repositories/account.repository.js";
import { inject, injectable } from "tsyringe";
import crypto from "node:crypto";
import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

@injectable()
export class RegisterAccountUseCase implements IRegisterAccountUseCase {
  constructor(@inject("IAccountRepository") private accountRepository: IAccountRepository) {}

  public async registerAccount(dto: IRegisterAccountDTO): Promise<HotpAccountEntity | TotpAccountEntity> {
    if (dto.account.id && (await this.accountRepository.findById(dto.account.id))) {
      throw "This custom ID is already being used";
    }
    
    return await this.accountRepository.save({ ...dto.account, id: dto.account.id || crypto.randomUUID() });
  }
}
