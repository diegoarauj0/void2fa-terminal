import { backgroundColorComponent } from "@/tui/components/backgroundColor.component.js";
import { appNameComponent } from "@/tui/components/appName.component.js";
import { mainScreen } from "@/tui/core/screen.js";
import blessed from "blessed";

export async function homePage(container: blessed.Widgets.Node) {
  backgroundColorComponent({ backgroundColor: "black", parent: container });

  const intervalID = await appNameComponent({
    backgroundColor: "black",
    color: "magenta",
    parent: container,
  });

  mainScreen.once("app:page.close", () => {
    clearInterval(intervalID);
  });
}
