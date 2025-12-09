import type { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import type { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";

export interface IOtpService {
  generateCode(account: TotpAccountEntity | HotpAccountEntity): string;
  getTotpRemaining(account: TotpAccountEntity): number;
  generateTotpCode(account: TotpAccountEntity): string;
  generateHotpCode(account: HotpAccountEntity): string;
}
