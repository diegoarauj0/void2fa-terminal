import type { Widgets } from "blessed";
import blessed from "blessed";
import { mainScreen } from "./screen.js";

let alertBox: Widgets.BoxElement | null = null;

export function createGlobalAlertBox() {
  if (alertBox) alertBox.parent.remove(alertBox);

  alertBox = blessed.box({
    width: "shrink",
    height: "shrink",
    top: "center",
    label: "Global Alert",
    left: "center",
    border: "line",
    hidden: true,
    style: {
      fg: "magenta",
      bg: "purple",
      border: { fg: "white" },
    },
  });

  mainScreen.append(alertBox);

  mainScreen.key(["escape"], () => {
    if (alertBox?.visible) hideAlert();
  });

  return alertBox;
}

export function showAlert(message: string, label?: string) {
  if (!alertBox) createGlobalAlertBox();

  alertBox?.setLabel(`${label || "Global Alert"}`);
  alertBox!.setContent(`${message}`);
  alertBox!.show();
  
  mainScreen.render();
}

export function hideAlert() {
  if (!alertBox) return;
  alertBox.hide();
  mainScreen.render();
}
