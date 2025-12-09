import { mainScreen } from "@/tui/core/screen.js";
import type { Schema } from "joi";
import blessed from "blessed";

export interface InputProps {
  parent: blessed.Widgets.Node;
  backgroundColor: string;
  initialValue?: string;
  title: string;
  label: string;
  color: string;
  schema: Schema;
}

interface InputPromise<V> {
  containerBox: blessed.Widgets.BoxElement;
  value: V;
}

export function inputComponent<V = string>(props: InputProps): Promise<InputPromise<V>> {
  return new Promise((resolve) => {
    const { color, backgroundColor, label, parent, schema, title, initialValue } = props;

    const containerBox = blessed.box({
      parent,
      height: "100%",
      width: "100%",
      style: { bg: backgroundColor },
    });

    const inputBox = blessed.textbox({
      parent: containerBox,
      label,
      border: "line",
      width: "50%",
      height: 3,
      top: "center",
      left: "center",
      inputOnFocus: true,
      value: initialValue ?? "",
      style: {
        fg: color,
        bg: backgroundColor,
        label: { fg: color, bg: backgroundColor },
        border: { fg: color, bg: backgroundColor },
        focus: { border: { fg: color } },
      },
    });

    blessed.box({
      parent: containerBox,
      content: title,
      width: "shrink",
      height: 1,
      top: "40%",
      left: "center",
      style: {
        fg: color,
        bg: backgroundColor,
      },
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

    inputBox.focus();

    containerBox.removeAllListeners("on")
    containerBox.on("click", () => { inputBox.focus() })

    inputBox.on("submit", async () => {
      const text = inputBox.value;

      const result = schema.validate(text);

      if (result.error) {
        errorBox.hidden = false;
        errorBox.setContent(result.error.message);
        inputBox.focus();
        mainScreen.emit("app:render");
        return;
      }

      containerBox.hidden = true;
      resolve({ value: result.value, containerBox });
    });
  });
}
