import { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

export interface IRegisterAccountDTO {
  account:
    | (Omit<HotpAccountEntity, "id" | "code"> & { id?: string })
    | (Omit<TotpAccountEntity, "id" | "code"> & { id?: string });
}

export interface IRegisterAccountUseCase {
  registerAccount: (dto: IRegisterAccountDTO) => Promise<HotpAccountEntity | TotpAccountEntity>;
}
