import { hotpAccountRepository, totpAccountRepository } from "@/repositories/index.js";
import type { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import type { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import speakeasy from "speakeasy";

export function getTotpRemaining(period: number) {
  return period - (Math.floor(Date.now() / 1000) % period);
}

export async function findAccountByID(id: string) {
  return (
    (await hotpAccountRepository.findAccountByID(id)) || (await totpAccountRepository.findAccountByID(id))
  );
}

export async function findAccountByName(name: string) {
  return (
    (await hotpAccountRepository.findAccountByName(name)) ||
    (await totpAccountRepository.findAccountByName(name))
  );
}

export function detectEncoding(secret: string) {
  if (secret.replace(/[0-9A-F]/gi, "").length === 0) return "hex";
  if (secret.replace(/[2-7A-Z]/g, "").length === 0) return "base32";
  if (secret.replace(/[0-9a-z+/=]/gi, "").length === 0) return "base64";
  return "ascii";
}

export function generateTotpCode(totpAccountEntity: TotpAccountEntity): string {
  return speakeasy.totp({
    secret: totpAccountEntity.secret,
    algorithm: totpAccountEntity.algorithm,
    digits: totpAccountEntity.digits,
    step: totpAccountEntity.period,
    encoding: totpAccountEntity.encoding,
  });
}

export function generateHotpCode(hotpAccountEntity: HotpAccountEntity): string {
  return speakeasy.hotp({
    counter: hotpAccountEntity.counter,
    secret: hotpAccountEntity.secret,
    algorithm: hotpAccountEntity.algorithm,
    digits: hotpAccountEntity.digits,
    encoding: hotpAccountEntity.encoding,
  });
}

export async function findAllAccounts() {
  return [
    ...(await hotpAccountRepository.findAllAccounts()),
    ...(await totpAccountRepository.findAllAccounts()),
  ];
}
