import { h } from "vue";
import { IBLOCKS, IAnnotations, IRichText } from "./types";

function handleAnnotationStyles(annotation: IAnnotations) {
  const styles = {
    "font-family": `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"`,
    "caret-color": "rgb(55, 53, 47)",
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

const defaultBlockRenderers = {
  [IBLOCKS.heading_1]: (block, key, next) => {
    return h(
      "h1",
      {
        key,
        style: {
          ...handleAnnotationStyles(block.heading_1.rich_text[0].annotations),
          "font-size": "1.875em",
        },
      },
      next
    );
  },
  [IBLOCKS.heading_2]: (block, key, next) => {
    return h(
      "h2",
      {
        key,
        style: {
          ...handleAnnotationStyles(block.heading_2.rich_text[0].annotations),
          "font-size": "1.5em",
        },
      },
      next
    );
  },
  [IBLOCKS.heading_3]: (block, key, next) => {
    return h(
      "h2",
      {
        key,
        style: {
          ...handleAnnotationStyles(block.heading_3.rich_text[0].annotations),
          "font-size": "1.25em",
        },
      },
      next
    );
  },
  [IBLOCKS.paragraph]: (block, key, next) => {
    return h(
      "p",
      {
        key,
        style: {
          ...handleAnnotationStyles(block.paragraph.rich_text[0].annotations),
        },
      },
      next
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

function renderBlockList(blocks, key, renderer) {
  return blocks.map((block, i) => renderBlock(block, `${key}-${i}`, renderer));
}

function renderBlock(block, key, renderer) {
  const blockRenderer = renderer.block;
  return blockRenderer[block.type](
    block,
    key,
    block[block.type].rich_text[0].plain_text
  );
}

const RichText = ({ blockRenderers, annotationRenderers, blocks }) => {
  if (!blocks) {
    return console.warn("[notion-vue-renderer] No blocks provided");
  }
  const renderer = {
    block: {
      ...defaultBlockRenderers,
    },
  };
  return renderBlockList(blocks, "block", renderer);
};

RichText.props = ["blocks"];

export default RichText;
