import { Layout, LayoutIndex, BasicPane, TextOptions } from "../RenderLayout";

const INDEX_SPLIT_CHAR = "-";

export function layoutIsEmpty(layout: Layout | undefined): boolean {
  if (!layout) return true;

  // Check immediate panes
  if (layout.panes.some((pane) => pane.paneType != null)) {
    return false;
  }

  // Check nested panes
  for (const pane of layout.panes) {
    if (pane.content && !layoutIsEmpty(pane.content)) {
      return false;
    }
  }

  return true;
}

export function updateLayoutSize(
  layout: Layout,
  index: LayoutIndex,
  sizes: number[],
): Layout {
  const newLayout = {
    ...layout,
    panes: layout?.panes ? [...layout.panes] : [],
  };

  if (typeof index === "number") {
    const isRootLayout = sizes.length === 1;
    if (isRootLayout) {
      newLayout.panes[index].size = sizes[0];
    } else {
      newLayout.panes[index]?.content?.panes.forEach((pane, index) => {
        pane.size = sizes[index];
      });
    }
    return newLayout;
  } else {
    const [first, ...rest] = index.split(INDEX_SPLIT_CHAR).map(Number);

    if (
      "content" in newLayout.panes[first] &&
      typeof newLayout.panes[first].content === "object"
    ) {
      newLayout.panes[first].content = updateLayoutSize(
        newLayout.panes[first].content as Layout,
        rest.length > 1 ? rest.join(INDEX_SPLIT_CHAR) : rest[0],
        sizes,
      );
    }
    return newLayout;
  }
}

export function attachText(
  layout: Layout,
  index: LayoutIndex,
  text: string,
  options?: TextOptions,
): Layout {
  const newLayout = {
    ...layout,
    panes: layout?.panes ? [...layout.panes] : [],
  };

  if (typeof index === "number") {
    newLayout.panes[index] = {
      ...newLayout.panes[index],
      text,
      options,
      paneType: "NodePane",
    };
    return newLayout;
  } else {
    const [first, ...rest] = index.split(INDEX_SPLIT_CHAR).map(Number);

    if (
      "content" in newLayout.panes[first] &&
      typeof newLayout.panes[first].content === "object"
    ) {
      newLayout.panes[first].content = attachText(
        newLayout.panes[first].content as Layout,
        rest.length > 1 ? rest.join(INDEX_SPLIT_CHAR) : rest[0],
        text,
        options,
      );
    }
    return newLayout;
  }
}

export function attachNode(
  layout: Layout,
  index: LayoutIndex,
  nodeId: string,
  fieldNames: string[],
): Layout {
  const newLayout = {
    ...layout,
    panes: layout?.panes ? [...layout.panes] : [],
  };

  if (typeof index === "number") {
    newLayout.panes[index] = {
      ...newLayout.panes[index],
      nodeId,
      fieldNames: fieldNames,
      paneType: "NodePane",
    };
    return newLayout;
  } else {
    const [first, ...rest] = index.split(INDEX_SPLIT_CHAR).map(Number);

    if (
      "content" in newLayout.panes[first] &&
      typeof newLayout.panes[first].content === "object"
    ) {
      newLayout.panes[first].content = attachNode(
        newLayout.panes[first].content as Layout,
        rest.length > 1 ? rest.join(INDEX_SPLIT_CHAR) : rest[0],
        nodeId,
        fieldNames,
      );
    }
    return newLayout;
  }
}

export function splitPane(
  layout: Layout,
  index: LayoutIndex,
  type: "horizontal" | "vertical",
  firstParentIndex?: LayoutIndex,
): Layout {
  const newLayout = { ...layout, panes: [...layout.panes] };

  if (firstParentIndex == null) {
    firstParentIndex = index;
  }

  if (typeof index === "string" && index.includes(INDEX_SPLIT_CHAR)) {
    const [first, ...rest] = index.split(INDEX_SPLIT_CHAR).map(Number);

    if (
      "content" in newLayout.panes[first] &&
      typeof newLayout.panes[first].content === "object"
    ) {
      newLayout.panes[first].content = splitPane(
        newLayout.panes[first].content as Layout,
        rest.length > 1 ? rest.join(INDEX_SPLIT_CHAR) : rest[0],
        type,
        firstParentIndex,
      );
    }
    return newLayout;
  } else {
    const paneIndex = typeof index === "string" ? Number(index) : index;

    const newPanes: BasicPane[] = [
      {
        ...layout.panes[paneIndex],
        paneType: "NodePane",
        size: layout.panes[paneIndex].size / 2,
      },
      {
        paneType: "NodePane",
        size: layout.panes[paneIndex].size / 2,
      },
    ];

    newLayout.panes[paneIndex] = {
      content: {
        type,
        panes: newPanes,
      },
      size: layout.panes[paneIndex].size,
    };
    return newLayout;
  }
}

export function deletePane(layout: Layout, index: LayoutIndex): Layout {
  const newLayout = { ...layout, panes: [...layout.panes] };

  if (typeof index === "string" && !index.includes(INDEX_SPLIT_CHAR)) {
    index = +index;
  }

  if (typeof index === "number") {
    newLayout.panes.splice(index, 1);
    return newLayout;
  } else {
    const [first, ...rest] = index.split(INDEX_SPLIT_CHAR).map(Number);
    if (
      "content" in newLayout.panes[first] &&
      typeof newLayout.panes[first].content === "object"
    ) {
      const newContent = deletePane(
        newLayout.panes[first].content as Layout,
        rest.join("-"),
      );
      if (newContent.panes.length === 0) {
        newLayout.panes.splice(first, 1);
      } else {
        newLayout.panes[first].content = newContent;
      }
    }
    return newLayout;
  }
}
