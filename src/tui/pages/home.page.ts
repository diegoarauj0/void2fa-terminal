import { backgroundColorComponent } from "../components/backgroundColor.component.js";
import { appNameComponent } from "../components/appName.component.js";
import { mainScreen } from "../core/screen.js";
import blessed from "blessed";

export async function homePage(container: blessed.Widgets.Node) {
  backgroundColorComponent({ backgroundColor: "black", parent: container });

  const { internalID } = await appNameComponent({
    backgroundColor: "black",
    color: "magenta",
    parent: container,
  });

  mainScreen.on("app:page.close", (name: string) => {
    if (name === "home") clearInterval(internalID);
  });
}
