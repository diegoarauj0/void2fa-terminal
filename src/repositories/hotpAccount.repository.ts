import { HotpAccountEntity } from "@/entities/hotpAccount.entity.js";
import { config } from "@/config.js";
import keytar from "keytar";
import path from "path";
import fs from "fs";

const hotpAccountCache: Map<string, HotpAccountEntity> = new Map();

interface HotpAccountData {
  encoding: "ascii" | "hex" | "base32" | "base64";
  algorithm: "sha1" | "sha256" | "sha512";
  counter: number;
  digits: number;
  issuer: string;
  name: string;
  id: string;
}

class HotpAccountRepository {
  private cacheLoaded = false;

  private async loadCache(): Promise<void> {
    if (this.cacheLoaded || hotpAccountCache.size > 0) return;

    const accounts = await this.readFile();

    for (const account of accounts) {
      const secret = await keytar.getPassword(config.serviceName, account.id);
      if (!secret) continue;

      hotpAccountCache.set(
        account.id,
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

    this.cacheLoaded = true;
  }

  private async readFile(): Promise<HotpAccountData[]> {
    try {
      const content = await fs.promises.readFile(config.hotpAccountFile, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw err;
    }
  }

  private async writeFile(data: HotpAccountData[]): Promise<void> {
    if (!fs.existsSync(config.hotpAccountFile)) {
      await fs.promises.mkdir(path.parse(config.hotpAccountFile).dir, { recursive: true });
    }

    await fs.promises.writeFile(config.hotpAccountFile, JSON.stringify(data, null, 2), "utf-8");
  }

  private static toPersistence(entity: HotpAccountEntity): HotpAccountData {
    return {
      id: entity.id,
      issuer: entity.issuer,
      name: entity.name,
      algorithm: entity.algorithm,
      digits: entity.digits,
      counter: entity.counter,
      encoding: entity.encoding,
    };
  }

  public async findAllAccounts(): Promise<HotpAccountEntity[]> {
    await this.loadCache();

    const accounts: HotpAccountEntity[] = [];

    hotpAccountCache.forEach((hotpAccount) => {
      accounts.push(hotpAccount);
    });

    return accounts;
  }

  public async findAccountByID(id: string): Promise<HotpAccountEntity | null> {
    await this.loadCache();
    return hotpAccountCache.get(id) ?? null;
  }

  public async findAccountByName(name: string): Promise<HotpAccountEntity | null> {
    await this.loadCache();
    let account = null;

    hotpAccountCache.forEach((v) => {
      if (v.name === name) {
        account = v;
      }
    });

    return account;
  }

  public async save(entity: HotpAccountEntity): Promise<HotpAccountEntity> {
    let accounts = await this.readFile();

    await keytar.setPassword(config.serviceName, entity.id, entity.secret);

    const exists = await this.findAccountByID(entity.id);

    const toPersist = HotpAccountRepository.toPersistence(entity);

    if (!exists) {
      accounts.push(toPersist);
    } else {
      accounts = accounts.map((acc) => (acc.id === entity.id ? toPersist : acc));
    }

    hotpAccountCache.set(entity.id, entity);
    await this.writeFile(accounts);

    return entity;
  }

  public async delete(entity: HotpAccountEntity): Promise<void> {
    const exists = await this.findAccountByID(entity.id);
    if (!exists) return;

    const accounts = (await this.readFile()).filter((acc) => acc.id !== entity.id);

    await keytar.deletePassword(config.serviceName, entity.id);
    hotpAccountCache.delete(entity.id);

    await this.writeFile(accounts);
  }
}

export const hotpAccountRepository = new HotpAccountRepository();
