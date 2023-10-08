import { VNode, h } from "vue";
import {
  IBLOCKS,
  IAnnotations,
  IRichText,
  IRichTextProps,
  IBlock,
  IRenderer,
} from "./types";

export const defaultFontStyle = {
  "font-family": `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"`,
  "caret-color": "rgb(55, 53, 47)",
};

function handleAnnotationStyles(annotation: IAnnotations) {
  const styles = {
    ...defaultFontStyle,
  };
  if (annotation.bold) {
    styles["font-weight"] = "bold";
  }
  if (annotation.italic) {
    styles["font-style"] = "italic";
  }
  if (annotation.underline) {
    styles["text-decoration"] = "underline";
  }
  if (annotation.strikethrough) {
    styles["text-decoration"] = "line-through";
  }
  if (annotation.code) {
    styles["font-family"] = "monospace";
  }
  if (annotation.color) {
    styles["color"] = annotation.color;
  }
  return styles;
}

function defaultRichTextRenderer(
  richTextArray: IRichText[],
  key: string,
  annotationRenderer
) {
  if (!richTextArray.length) {
    return null;
  }
  const result = richTextArray.map((richText, i) => {
    const attributes = {
      style: handleAnnotationStyles(richText.annotations),
      key: `${key}-annotation-${i}`,
    };
    if (richText.text.link) attributes["href"] = richText.href;
    if (i < richTextArray.length - 1)
      attributes["style"]["margin-right"] = "4px";
    return h(
      richText.text.link ? "a" : "span",
      attributes,
      richText.text.content
    );
  });
  return h("span", { key }, result);
}

const defaultBlockRenderers = {
  [IBLOCKS.heading_1]: (block: IBlock, key: string, next: VNode) => {
    return h(
      "h1",
      {
        key,
        style: {
          "font-size": "1.875em",
        },
      },
      next
    );
  },
  [IBLOCKS.heading_2]: (block: IBlock, key: string, next: VNode) => {
    return h(
      "h2",
      {
        key,
        style: {
          "font-size": "1.5em",
        },
      },
      next
    );
  },
  [IBLOCKS.heading_3]: (block: IBlock, key: string, next: VNode) => {
    return h(
      "h3",
      {
        key,
        style: {
          "font-size": "1.25em",
        },
      },
      next
    );
  },
  [IBLOCKS.paragraph]: (block: IBlock, key: string, next: VNode) => {
    return h(
      "p",
      {
        key,
        style: {
          "font-size": "1em",
          "word-wrap": "break-word",
          "white-space": "pre-wrap",
        },
      },
      next
    );
  },
  [IBLOCKS.bulleted_list_item]: (block: IBlock, key: string, next: VNode) => {
    const childeLi = h("li", { key, style: { padding: "0.25em  0" } }, next);
    return h(
      "ul",
      {
        key,
        style: {},
      },
      childeLi
    );
  },
  [IBLOCKS.numbered_list_item]: (block: IBlock, key: string, next: VNode) => {
    const childeLi = h("li", { key, style: { padding: "0.25em  0" } }, next);
    return h(
      "ol",
      {
        key,
        style: {},
      },
      childeLi
    );
  },
  [IBLOCKS.to_do]: (block: IBlock, key: string, next: VNode) => {
    const checkBox = h("input", {
      type: "checkbox",
      style: {
        boxSizing: "border-box",
        height: "16px",
        width: "16px",
        border: block.to_do.checked ? "none" : "1px solid black",
        backgroundColor: block.to_do.checked ? "rgb(35, 131, 226)" : "white",
      },
      checked: block.to_do.checked,
    });
    const checkBoxTextStyle = {
      textDecoration: block.to_do.checked
        ? "line-through rgba(55, 53, 47, 0.25)"
        : "none",
      color: block.to_do.checked ? "rgba(55, 53, 47, 0.65)" : "inherit",
    };
    const checkBoxTextArea = h(
      "div",
      { key, style: { ...checkBoxTextStyle, padding: "0.25em  0" } },
      next
    );
    return h(
      "div",
      {
        key,
        style: {
          display: "flex",
          gap: "0.5em",
          alignItems: "center",
        },
      },
      [checkBox, checkBoxTextArea]
    );
  },
  text: (richTextArray: IRichText[], key, annotationRenderer) => {
    if (!richTextArray.length) {
      return null;
    }
    const result = richTextArray.map((richText, i) => {
      h(
        "span",
        {
          style: handleAnnotationStyles(richText.annotations),
          key: `annotation-${i}`,
        },
        richText.text.content
      );
    });
    return h("span", { key }, result);
  },
};

function renderBlockList(
  blocks: IBlock[],
  key: string,
  renderer: IRenderer
): VNode[] {
  return blocks.map((block, i) => renderBlock(block, `${key}-${i}`, renderer));
}

function renderBlock(block: IBlock, key: string, renderer: IRenderer) {
  const blockRenderer = renderer.block;
  if (!blockRenderer[block.type]) {
    console.warn(
      `[notion-vue-renderer] Unsupported block type "${block.type}". Please create an issue if you'd like to see it supported`
    );
    return null;
  }
  return blockRenderer[block.type](
    block,
    key,
    defaultRichTextRenderer(block[block.type].rich_text, key, renderer)
  );
}

const RichText = ({
  blockRenderers,
  annotationRenderers,
  blocks,
}: IRichTextProps) => {
  if (!blocks) {
    return console.warn("[notion-vue-renderer] No blocks provided");
  }
  const renderer = {
    block: {
      ...defaultBlockRenderers,
    },
  } as any;
  if (blockRenderers) {
    renderer.block = {
      ...renderer.block,
      ...blockRenderers,
    };
  }
  const results = renderBlockList(blocks, "block", renderer);
  return formatLists(removeNulls(results));
};

function removeNulls(array: VNode[]) {
  return array.filter((item) => item !== null);
}

function formatLists(blocks: any[]): VNode[] {
  const output = [];
  const indexesToRemove = [];
  let lastBlock: VNode = null;
  for (const block of blocks) {
    if (lastBlock && block.type === "ul" && lastBlock.type === "ul") {
      const newUnorderedList = h("ul", { key: lastBlock.key }, [
        ...(lastBlock.children as VNode[]),
        ...block.children,
      ]);
      output.push(newUnorderedList);
      indexesToRemove.push(output.length - 2);
      lastBlock = newUnorderedList;
    } else if (lastBlock && block.type === "ol" && lastBlock.type === "ol") {
      const newOrderedList = h(
        "ol",
        { key: lastBlock.key, style: { ...defaultFontStyle } },
        [...(lastBlock.children as any), ...block.children]
      );
      output.push(newOrderedList);
      indexesToRemove.push(output.length - 2);
      lastBlock = newOrderedList;
    } else {
      output.push(block);
      lastBlock = block;
    }
  }
  return output.filter((item, index) => !indexesToRemove.includes(index));
}

RichText.props = ["blocks", "blockRenderers", "annotationRenderers"];

export default RichText;
