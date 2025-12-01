import { TotpAccountEntity } from "@/entities/totpAccount.entity.js";
import { config } from "@/config.js";
import keytar from "keytar";
import fs from "fs";
import path from "path";

const totpAccountCache: Map<string, TotpAccountEntity> = new Map();

interface TotpAccountData {
  encoding: "ascii" | "hex" | "base32" | "base64";
  algorithm: "sha1" | "sha256" | "sha512";
  period: number;
  digits: number;
  issuer: string;
  name: string;
  id: string;
}

class TotpAccountRepository {
  private cacheLoaded = false;

  private async loadCache(): Promise<void> {
    if (this.cacheLoaded || totpAccountCache.size > 0) return;

    const accounts = await this.readFile();

    for (const account of accounts) {
      const secret = await keytar.getPassword(config.serviceName, account.id);
      if (!secret) continue;

      totpAccountCache.set(
        account.id,
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

    this.cacheLoaded = true;
  }

  private async readFile(): Promise<TotpAccountData[]> {
    try {
      const content = await fs.promises.readFile(config.totpAccountFile, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw err;
    }
  }

  private async writeFile(data: TotpAccountData[]): Promise<void> {
    if (!fs.existsSync(config.totpAccountFile)) {
      await fs.promises.mkdir(path.parse(config.totpAccountFile).dir, { recursive: true });
    }

    await fs.promises.writeFile(config.totpAccountFile, JSON.stringify(data, null, 2), "utf-8");
  }

  private static toPersistence(entity: TotpAccountEntity): TotpAccountData {
    return {
      id: entity.id,
      issuer: entity.issuer,
      name: entity.name,
      algorithm: entity.algorithm,
      digits: entity.digits,
      period: entity.period,
      encoding: entity.encoding,
    };
  }

  public async findAccountByName(name: string): Promise<TotpAccountEntity | null> {
    await this.loadCache();
    let account = null;

    totpAccountCache.forEach((v) => {
      if (v.name === name) {
        account = v;
      }
    });

    return account;
  }

  public async findAllAccounts(): Promise<TotpAccountEntity[]> {
    await this.loadCache();

    const accounts: TotpAccountEntity[] = [];

    totpAccountCache.forEach((totpAccount) => {
      accounts.push(totpAccount);
    });

    return accounts;
  }

  public async findAccountByID(id: string): Promise<TotpAccountEntity | null> {
    await this.loadCache();
    return totpAccountCache.get(id) ?? null;
  }

  public async save(entity: TotpAccountEntity): Promise<TotpAccountEntity> {
    await this.loadCache();

    let accounts = await this.readFile();

    if (totpAccountCache.get(entity.id)?.secret !== entity.secret) {
      await keytar.deletePassword(config.serviceName, entity.id);
    }

    await keytar.setPassword(config.serviceName, entity.id, entity.secret);

    const exists = await this.findAccountByID(entity.id);

    const toPersist = TotpAccountRepository.toPersistence(entity);

    if (!exists) {
      accounts.push(toPersist);
    } else {
      accounts = accounts.map((acc) => (acc.id === entity.id ? toPersist : acc));
    }

    totpAccountCache.set(entity.id, entity);
    await this.writeFile(accounts);

    return entity;
  }

  public async delete(entity: TotpAccountEntity): Promise<void> {
    const exists = await this.findAccountByID(entity.id);
    if (!exists) return;

    const accounts = (await this.readFile()).filter((acc) => acc.id !== entity.id);

    await keytar.deletePassword(config.serviceName, entity.id);
    totpAccountCache.delete(entity.id);

    await this.writeFile(accounts);
  }
}

export const totpAccountRepository = new TotpAccountRepository();
