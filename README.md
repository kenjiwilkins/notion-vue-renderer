# notion-vue-renderer

Vue 3 renderer for notion blocks

## Changelog

See releases page for changelog of versions.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install notion-vue-renderer
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add notion-vue-renderer
```

## Usage

```html
<script>
  import BlocksRenderer from "notion-vue-renderer";

  const blocks = {
    object: "list",
    results: [
      {
        object: "block",
        type: "heading_1",
        heading_1: {
          text: [
            {
              type: "text",
              text: {
                content: "Hello World",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "Hello World",
              href: null,
            },
          ],
        },
      },
    ],
  };

  export default {
    data() {
      return {
        blocks: blocks.result,
      };
    },
  };
</script>

<template>
  <BlocksRenderer :blocks="blocks" />
</template>
```

## Available Blocks

- `BLOCKS`

  - `PARAGRAPH`
  - `HEADING_1`
  - `HEADING_2`
  - `HEADING_3`
  - `BULLETED_LIST_ITEM`
  - `NUMBERED_LIST_ITEM`

- `ANNOTATIONS`
  - `BOLD`
  - `ITALIC`
  - `UNDERLINE`
  - `STRIKETHROUGH`
  - `CODE`
  - `LINK`

## Dear Developers

This project is still in development. If you have any suggestions or ideas, please feel free to open an issue or PR.
