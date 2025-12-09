import { HotpAccountEntity } from "@/domain/entities/hotpAccount.entity.js";
import { TotpAccountEntity } from "@/domain/entities/totpAccount.entity.js";
import { accountRepository } from "@/repositories/account.repository.js";
import { hideAlert, showAlert } from "@/tui/core/globalAlertBox.js";
import { otpService } from "@/services/otp.service.js";
import clipboard from "clipboardy";
import blessed from "blessed";

interface AccountProps {
  account: TotpAccountEntity | HotpAccountEntity;
  parent: blessed.Widgets.Node;
  top: number | string;
  left: number | string;
  width: number;
  height: number;
  backgroundColor: string;
  color: string;
}

export function accountComponent(props: AccountProps): void {
  const { parent, account, top, left, width, height, backgroundColor, color } = props;

  const accountBox = blessed.box({
    parent,
    width,
    height,
    top,
    left,
    border: "line",
    content: `Name: ${account.name}\nIssuer: ${account.issuer}`,
    style: {
      bg: backgroundColor,
      fg: color,
      border: {
        bg: backgroundColor,
        fg: color,
      },
    },
  });

  function setContent(code: string, text: string) {
    accountBox.setContent(`Name: ${account.name.toValue()}\nIssuer: ${account.issuer.toValue()}\nCode: ${code}\n${text}`);
  }

  if (account instanceof HotpAccountEntity) {
    setContent(otpService.generateHotpCode(account), `Counter: ${account.counter.toValue()}`);

    accountBox.on("click", async () => {
      const code = otpService.generateHotpCode(account);
      await clipboard.write(code || "");

      account.addCounter()

      await accountRepository.save(account);

      setContent(otpService.generateHotpCode(account), `Counter: ${account.counter.toValue()}`);

      showAlert("Code copied to clipboard", "Success!");
      setTimeout(hideAlert, 2000);
    });
  }

  if (account instanceof TotpAccountEntity) {
    accountBox.on("click", async () => {
      const code = otpService.generateTotpCode(account);
      await clipboard.write(code || "");

      showAlert("Code copied to clipboard", "Success!");
      setTimeout(hideAlert, 2000);
    });

    const remaining = otpService.getTotpRemaining(account);
    const progressBar = "*".repeat(((width - 4) / 100) * (remaining / (account.period.toValue() / 100)));

    setContent(otpService.generateTotpCode(account), `${remaining < 10 ? `0${remaining}` : remaining}: ${progressBar}`);
  }
}
