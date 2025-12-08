import { mainScreen } from "../core/screen.js";
import type { Schema } from "joi";
import blessed from "blessed";

export interface SelectProps {
  parent: blessed.Widgets.Node;
  backgroundColor: string;
  label: string;
  color: string;
  items: string[];
  height: number;
  width: number;
}

interface SelectPromise {
  containerBox: blessed.Widgets.BoxElement;
  value: string;
}

export function selectComponent(props: SelectProps): Promise<SelectPromise> {
  return new Promise((resolve) => {
    const { color, backgroundColor, label, parent, items, height, width } = props;

    const containerBox = blessed.box({
      parent,
      height: "100%",
      width: "100%",
      style: { bg: backgroundColor },
    });

    const select = blessed.list({
      parent: containerBox,
      width,
      height,
      top: "center",
      left: "center",
      keys: true,
      label,
      mouse: true,
      border: "line",
      style: {
        bg: backgroundColor,
        label: { bg: backgroundColor, fg: color } as any,
        border: { bg: backgroundColor, fg: color },
        selected: { bg: color, fg: "white" },
        item: { hover: { bg: "gray" } },
      },
      items,
    });

    const errorBox = blessed.box({
      parent: containerBox,
      width: "shrink",
      height: 3,
      border: "line",
      top: "55%",
      hidden: true,
      label: "Error:",
      left: "center",
      content: "",
      style: {
        fg: "red",
        bg: backgroundColor,
        label: { fg: "red", bg: backgroundColor },
        border: { fg: "red", bg: backgroundColor },
      },
    });

    select.focus();

    select.on("select", (item, index) => {
      resolve({ value: item.getText(), containerBox });
    });

    mainScreen.emit("app:render");
  });
}
