import type { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import speakeasy from "speakeasy";

class OtpService {
  public getTotpRemaining(account: TotpAccountEntity): number {
    return account.period.toValue() - (Math.floor(Date.now() / 1000) % account.period.toValue());
  }

  public generateHotpCode(account: HotpAccountEntity): string {
    return speakeasy.hotp({
      secret: account.secret.toValue(),
      encoding: account.encoding.toValue(),
      digits: account.digits.toValue(),
      algorithm: account.algorithm.toValue(),
      counter: account.counter.toValue(),
    });
  }

  public generateTotpCode(account: TotpAccountEntity): string {
    return speakeasy.totp({
      secret: account.secret.toValue(),
      encoding: account.encoding.toValue(),
      digits: account.digits.toValue(),
      algorithm: account.algorithm.toValue(),
      step: account.period.toValue(),
    });
  }

  public generateCode(account: TotpAccountEntity | HotpAccountEntity): string {
    if (account instanceof TotpAccountEntity) return this.generateTotpCode(account);

    return this.generateHotpCode(account);
  }
}

export const otpService = new OtpService();
