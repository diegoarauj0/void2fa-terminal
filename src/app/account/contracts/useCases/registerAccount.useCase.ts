import { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

export interface IRegisterAccountDTO {
  account: Omit<HotpAccountEntity, "id"> | Omit<TotpAccountEntity, "id">;
}

export interface IRegisterAccountUseCase {
  registerAccount: (dto: IRegisterAccountDTO) => Promise<void>;
}
