import type { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

export interface IEditAccountDTO {
  account: Partial<HotpAccountEntity> & { type: "HOTP", id: string } | Partial<TotpAccountEntity> & { type: "TOTP", id: string };
}

export interface IEditAccountUseCase {
  editAccount: (dto: IEditAccountDTO) => Promise<void>;
}
