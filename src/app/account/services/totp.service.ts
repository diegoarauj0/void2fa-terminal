import type { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";
import type { ITotpService } from "../contracts/services/totp.service.js";
import { totp, type Encoding } from "speakeasy";

export class TotpService implements ITotpService {
  private detectEncoding(secret: string): Encoding {
    if (secret.replace(/[0-9A-F]/gi, "").length === 0) return "hex";
    if (secret.replace(/[2-7A-Z]/g, "").length === 0) return "base32";
    if (secret.replace(/[0-9a-z+/=]/gi, "").length === 0) return "base64";
    return "ascii";
  }

  public generate(totpAccountEntity: TotpAccountEntity): string {
    return totp({
      secret: totpAccountEntity.secret,
      algorithm: totpAccountEntity.algorithm,
      digits: totpAccountEntity.digits,
      step: totpAccountEntity.period,
      encoding: this.detectEncoding(totpAccountEntity.encoding || ""),
    });
  }
}
