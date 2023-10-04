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

function defaultRichTextRenderer(
  richTextArray: IRichText[],
  key,
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
  [IBLOCKS.heading_1]: (block, key, next) => {
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
  [IBLOCKS.heading_2]: (block, key, next) => {
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
  [IBLOCKS.heading_3]: (block, key, next) => {
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
  [IBLOCKS.paragraph]: (block, key, next) => {
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
  if (!blockRenderer[block.type]) {
    console.warn(`[notion-vue-renderer] Unsupported block type ${block.type}`);
    return null;
  } else {
    console.log(blockRenderer[block.type]);
  }
  return blockRenderer[block.type](
    block,
    key,
    defaultRichTextRenderer(block[block.type].rich_text, key, renderer)
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
