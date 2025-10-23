import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";

export interface ITotpService {
  generate: (totpAccountEntity: TotpAccountEntity) => string;
}
