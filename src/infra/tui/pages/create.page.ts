import blessed from "blessed";
import { backgroundColorComponent } from "../components/backgroundColor.component.js";
import { inputComponent } from "../components/input.component.js";
import * as schema from "@/infra/validators/account.validators.js";
import { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import { detectEncoding } from "@/utils/account.utils.js";
import { totpAccountRepository } from "@/repositories/totpAccount.repository.js";
import { mainScreen } from "../core/screen.js";
import { selectComponent } from "../components/select.component.js";
import { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import { hotpAccountRepository } from "@/repositories/hotpAccount.repository.js";

export async function createPage(container: blessed.Widgets.Node) {
  backgroundColorComponent({ backgroundColor: "black", parent: container });

  const accountName = await inputComponent<string>({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Name:",
    title: "Account Name",
    schema: schema.accountName.required().label("name"),
  });

  accountName.containerBox.destroy();

  const issuer = await inputComponent<string>({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Issuer:",
    title: "Issuer",
    schema: schema.accountIssuer.required().label("issuer"),
  });

  issuer.containerBox.destroy();

  const secret = await inputComponent<string>({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Secret:",
    title: "Account Secret",
    schema: schema.accountSecret.required().label("secret"),
  });

  secret.containerBox.destroy();

  const digits = await inputComponent<number>({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Digits:",
    title: "TOTP Code Digits",
    initialValue: "6",
    schema: schema.accountDigits.required().label("digits"),
  });

  digits.containerBox.destroy();

  const algorithm = await selectComponent({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Algorithm:",
    width: 20,
    height: 5,
    items: ["sha1", "sha256", "sha512"],
  });

  algorithm.containerBox.destroy();

  const type = await selectComponent({
    parent: container,
    backgroundColor: "black",
    color: "magenta",
    label: "Account Type:",
    width: 40,
    height: 4,
    items: ["TOTP (Time-based One-Time Password)", "HOTP (HMAC-based One-Time Password)"],
  });

  type.containerBox.destroy();

  const id = crypto.randomUUID();

  if (type.value === "TOTP (Time-based One-Time Password)") {
    const period = await inputComponent<number>({
      parent: container,
      backgroundColor: "black",
      color: "magenta",
      label: "Period:",
      title: "TOTP Refresh Interval (seconds)",
      initialValue: "30",
      schema: schema.accountPeriod.required().label("period"),
    });

    period.containerBox.destroy();

    const newAccount = new TotpAccountEntity(
      id,
      secret.value,
      period.value,
      digits.value,
      algorithm.value.toLowerCase() as any,
      issuer.value,
      accountName.value,
      detectEncoding(secret.value),
    );

    await totpAccountRepository.save(newAccount);
  }

  if (type.value === "HOTP (HMAC-based One-Time Password)") {
    const counter = await inputComponent<number>({
      parent: container,
      backgroundColor: "black",
      color: "magenta",
      label: "Counter:",
      title: "HOTP Counter",
      initialValue: "0",
      schema: schema.accountCounter.required().label("counter"),
    });

    counter.containerBox.destroy();

    const newAccount = new HotpAccountEntity(
      id,
      secret.value,
      counter.value,
      digits.value,
      algorithm.value.toLowerCase() as any,
      issuer.value,
      accountName.value,
      detectEncoding(secret.value),
    );

    await hotpAccountRepository.save(newAccount);
  }

  mainScreen.emit("app:page.change", "accounts");
}
