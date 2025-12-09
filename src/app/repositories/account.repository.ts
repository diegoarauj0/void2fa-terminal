import { ValueAlreadyInUseDomainError } from "@/domain/errors/valueAlreadyInUseDomain.error.js";
import type { IAccountRepository } from "@/app/contracts/repositories/IAccount.repository.js";
import { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import type { IDVO, NameVO } from "@/domain/VOs/account.vo.js";
import { config } from "@/config.js";
import path from "path";
import fs from "fs";

class AccountRepository implements IAccountRepository {
  private async readFile(): Promise<Array<HotpAccountEntity | TotpAccountEntity>> {
    const accounts: Array<HotpAccountEntity | TotpAccountEntity> = [];

    const accountInString = await fs.promises.readFile(config.accountFile, "utf-8");
    const accountInObject = JSON.parse(accountInString) as { hotp?: any[]; totp?: any[] };

    accountInObject.hotp?.forEach((hotpAccountData) => {
      accounts.push(HotpAccountEntity.create(hotpAccountData));
    });

    accountInObject.totp?.forEach((totpAccountData) => {
      accounts.push(TotpAccountEntity.create(totpAccountData));
    });

    return accounts;
  }

  private async writeFile(accounts: Array<HotpAccountEntity | TotpAccountEntity>): Promise<void> {
    if (!fs.existsSync(config.accountFile)) {
      await fs.promises.mkdir(path.parse(config.accountFile).dir, { recursive: true });
    }

    const accountsData: { hotp: any[]; totp: any[] } = { hotp: [], totp: [] };

    accounts.forEach((account) => {
      if (account instanceof HotpAccountEntity) return accountsData.hotp.push(account.toJSON());

      return accountsData.totp.push(account.toJSON());
    });

    await fs.promises.writeFile(config.accountFile, JSON.stringify(accountsData), "utf-8");
  }

  public async findByName(name: NameVO): Promise<HotpAccountEntity | TotpAccountEntity | null> {
    const accounts = await this.readFile();
    return accounts.filter((v) => v.name.toValue() === name.toValue())[0] || null;
  }

  public async findById(id: IDVO): Promise<HotpAccountEntity | TotpAccountEntity | null> {
    const accounts = await this.readFile();
    return accounts.filter((v) => v.id.toValue() === id.toValue())[0] || null;
  }

  public async delete(account: HotpAccountEntity | TotpAccountEntity): Promise<void> {
    const accounts = await this.readFile();

    await this.writeFile(accounts.filter((v) => v.id.toValue() !== account.id.toValue()));
  }

  public async save(account: HotpAccountEntity | TotpAccountEntity): Promise<typeof account> {
    const accounts = await this.readFile();

    const accountById = await this.findById(account.id);

    if (accountById === null) {
      if ((await this.findByName(account.name)) !== null) {
        throw new ValueAlreadyInUseDomainError(String(typeof account), "name", account.name.toValue());
      }

      accounts.push(account);

      await this.writeFile(accounts);

      return account;
    }

    if (!accountById.name.equal(account.name) && (await this.findByName(account.name)) !== null) {
      throw new ValueAlreadyInUseDomainError(String(typeof account), "name", account.name.toValue());
    }

    await this.writeFile(
      accounts.map((v) => {
        if (v.id.equal(account.id)) return account;
        return v;
      }),
    );

    return account;
  }
}

export const accountRepository = new AccountRepository()