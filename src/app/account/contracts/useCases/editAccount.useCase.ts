import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

export interface IEditAccountDTO {
  account: Partial<Omit<HotpAccountEntity, "type">> & { id: string } | Partial<Omit<TotpAccountEntity, "type">> & { id: string };
}

export interface IEditAccountUseCase {
  editAccount: (dto: IEditAccountDTO) => Promise<HotpAccountEntity | TotpAccountEntity>;
}
