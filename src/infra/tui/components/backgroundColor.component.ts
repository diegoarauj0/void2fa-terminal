import blessed from "blessed";

export interface BackgroundColorProps {
  parent: blessed.Widgets.Node;
  backgroundColor: string;
}

export function backgroundColorComponent(props: BackgroundColorProps) {
  const box = blessed.box({
    parent: props.parent,
    height: "100%",
    width: "100%",
    style: {
      bg: props.backgroundColor,
    },
  });

  return box;
}
