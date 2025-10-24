import { type IAccountRepository } from "@app/account/contracts/repositories/account.repository.js";
import { TotpAccountEntity } from "@domain/entities/totpAccount.entity.js";
import { HotpAccountEntity } from "@domain/entities/hotpAccount.entity.js";
import { injectable } from "tsyringe";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import keytar from "keytar";
import fs from "fs";

let accountsCache: Map<string, TotpAccountEntity | HotpAccountEntity> | null = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@injectable()
export class AccountRepository implements IAccountRepository {
  private get fileAccountPath() {
    return path.join(__dirname, "..", "..", "..", "..", "accounts.json");
  }

  private async loadCache(): Promise<void> {
    const accounts = await this.readAccountsFile();

    if (accountsCache !== null) {
      return;
    }

    accountsCache = new Map();

    accounts.hotp.forEach((account) => {
      accountsCache!.set(account.id, account);
    });

    accounts.totp.forEach((account) => {
      accountsCache!.set(account.id, account);
    });
  }

  private get cache(): { hotp: HotpAccountEntity[]; totp: TotpAccountEntity[] } {
    const accounts: { hotp: HotpAccountEntity[]; totp: TotpAccountEntity[] } = { hotp: [], totp: [] };

    accountsCache?.forEach((account) => {
      const accountType = account.type.toLowerCase() as "hotp" | "totp";

      if (accountType === "hotp") {
        accounts.hotp.push(account as HotpAccountEntity);
      }

      if (accountType == "totp") {
        accounts.totp.push(account as TotpAccountEntity);
      }
    });

    return accounts;
  }

  private async readAccountsFileInString(): Promise<string> {
    if (fs.existsSync(this.fileAccountPath)) {
      return await fs.promises.readFile(this.fileAccountPath, "utf-8");
    }

    return "{}";
  }

  private async readAccountsFile(): Promise<{ hotp: HotpAccountEntity[]; totp: TotpAccountEntity[] }> {
    const accounts = JSON.parse(await this.readAccountsFileInString()) as {
      hotp: Omit<HotpAccountEntity, "secret">[];
      totp: Omit<TotpAccountEntity, "secret">[];
    };

    if (accounts.hotp === undefined) {
      accounts.hotp = [];
    }
    if (accounts.totp === undefined) {
      accounts.totp = [];
    }

    const secretAccounts = { hotp: [], totp: [] } as {
      hotp: HotpAccountEntity[];
      totp: TotpAccountEntity[];
    };

    for (const account of accounts.hotp) {
      const secret = await keytar.getPassword("void2FA", account.id);
      if (secret) {
        secretAccounts.hotp.push(
          new HotpAccountEntity(
            account.id,
            secret,
            account.counter,
            account.digits,
            account.algorithm,
            account.issuer,
            account.name,
            account.encoding,
          ),
        );
      }
    }

    for (const account of accounts.totp) {
      const secret = await keytar.getPassword("void2FA", account.id);
      if (secret) {
        secretAccounts.totp.push(
          new TotpAccountEntity(
            account.id,
            secret,
            account.period,
            account.digits,
            account.algorithm,
            account.issuer,
            account.name,
            account.encoding,
          ),
        );
      }
    }

    return secretAccounts;
  }

  private async writeAccountFile(_accounts: {
    hotp: HotpAccountEntity[];
    totp: TotpAccountEntity[];
  }): Promise<void> {
    const accounts = { hotp: [], totp: [] } as {
      hotp: Omit<HotpAccountEntity, "secret">[];
      totp: Omit<TotpAccountEntity, "secret">[];
    };

    const secretsCache = new Map<string, string>();

    accountsCache?.forEach((v) => {
      secretsCache.set(v.id, v.secret);
    });

    accountsCache = new Map();

    for (const account of _accounts.hotp) {
      if (secretsCache.get(account.id) !== account.secret) {
        await keytar.setPassword("void2FA", account.id, account.secret);
      }

      accounts.hotp.push(JSON.parse(JSON.stringify({ ...account, secret: undefined })));
      accountsCache!.set(
        account.id,
        new HotpAccountEntity(
          account.id,
          account.secret,
          account.counter,
          account.digits,
          account.algorithm,
          account.issuer,
          account.name,
          account.encoding,
        ),
      );
    }

    for (const account of _accounts.totp) {
      if (secretsCache.get(account.id) !== account.secret) {
        await keytar.setPassword("void2FA", account.id, account.secret);
      }

      accounts.totp.push(JSON.parse(JSON.stringify({ ...account, secret: undefined })));
      accountsCache!.set(
        account.id,
        new TotpAccountEntity(
          account.id,
          account.secret,
          account.period,
          account.digits,
          account.algorithm,
          account.issuer,
          account.name,
          account.encoding,
        ),
      );
    }

    await fs.promises.writeFile(this.fileAccountPath, JSON.stringify(accounts, null, 2), "utf-8");
  }

  public async findById(id: string): Promise<HotpAccountEntity | TotpAccountEntity | null> {
    await this.loadCache();

    const account = accountsCache?.get(id);

    return account || null;
  }

  public async delete(id: string): Promise<void> {
    const account = await this.findById(id);

    if (account === null) {
      return;
    }

    const accounts = this.cache;
    const accountType = account.type.toLowerCase() as "hotp" | "totp";

    await keytar.deletePassword("void2FA", account.id);

    if (accountType === "hotp") {
      accounts.hotp = accounts.hotp.filter((v) => v.id !== id);
    } else {
      accounts.totp = accounts.totp.filter((v) => v.id !== id);
    }

    await this.writeAccountFile(accounts);
  }

  public async findAll(): Promise<(HotpAccountEntity | TotpAccountEntity)[]> {
    await this.loadCache();

    if (accountsCache) {
      return [...this.cache.hotp, ...this.cache.totp];
    }

    return [];
  }

  public async save(_account: HotpAccountEntity | TotpAccountEntity): Promise<typeof _account> {
    const accountType = _account.type.toLowerCase() as "hotp" | "totp";
    const account = await this.findById(_account.id);
    const accounts = this.cache;

    if (account) {
      if (accountType === "hotp") {
        accounts.hotp = accounts.hotp.map((existingAccount) =>
          existingAccount.id === _account.id ? (_account as HotpAccountEntity) : existingAccount,
        );
      } else {
        accounts.totp = accounts.totp.map((existingAccount) =>
          existingAccount.id === _account.id ? (_account as TotpAccountEntity) : existingAccount,
        );
      }

      await this.writeAccountFile(accounts);
      return _account;
    }

    if (accountType === "hotp") {
      accounts.hotp.push(_account as HotpAccountEntity);
      await this.writeAccountFile(accounts);
      return _account;
    }

    accounts.totp.push(_account as TotpAccountEntity);

    await this.writeAccountFile(accounts);
    return _account;
  }
}
