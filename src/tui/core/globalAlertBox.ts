import type { Widgets } from "blessed";
import blessed from "blessed";

let alertBox: Widgets.BoxElement | null = null;

export function createGlobalAlertBox(screen: Widgets.Screen) {
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

  screen.append(alertBox);

  screen.key(["escape"], () => {
    if (alertBox?.visible) hideAlert(screen);
  });

  return alertBox;
}

export function showAlert(screen: Widgets.Screen, message: string, label?: string) {
  if (!alertBox) createGlobalAlertBox(screen);

  alertBox?.setLabel(`${label || "Global Alert"}`);
  alertBox!.setContent(`${message}`);
  alertBox!.show();
  
  screen.render();
}

export function hideAlert(screen: Widgets.Screen) {
  if (!alertBox) return;
  alertBox.hide();
  screen.render();
}
