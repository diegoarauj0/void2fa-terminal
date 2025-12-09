import { accountRepository } from "@/repositories/account.repository.js";
import { IDVO, NameVO } from "@/domain/VOs/account.vo.js";
import { isUUID } from "./isUUID.js";

export async function findByIdOrName(idorname: string) {
  const account = isUUID(idorname)
    ? await accountRepository.findById(new IDVO(idorname))
    : await accountRepository.findByName(new NameVO(idorname));

  return account;
}
