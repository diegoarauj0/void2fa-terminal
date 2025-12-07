import { backgroundColorComponent } from "../components/backgroundColor.component.js";
import blessed from "blessed";

export function viewCodesPage(container: blessed.Widgets.Node) {
  backgroundColorComponent({ backgroundColor: "black", parent: container });
}
