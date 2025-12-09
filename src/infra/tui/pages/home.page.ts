import { backgroundColorComponent } from "../components/backgroundColor.component.js";
import { appNameComponent } from "../components/appName.component.js";
import { mainScreen } from "../core/screen.js";
import blessed from "blessed";

export async function homePage(container: blessed.Widgets.Node) {
  backgroundColorComponent({ backgroundColor: "black", parent: container });

  const { intervalID } = await appNameComponent({
    backgroundColor: "black",
    color: "magenta",
    parent: container,
  });

  mainScreen.once("app:page.close", () => {
    clearInterval(intervalID);
  });
}
