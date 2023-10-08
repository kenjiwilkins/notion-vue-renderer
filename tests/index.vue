<template>
  <renderer :blocks="document" />
  <input type="checkbox" />
</template>
<script>
// import renderer from "../lib/index.js";
import renderer from "../src/index";
import doc from "./test.json";
export default {
  components: {
    renderer,
  },
  data() {
    return {
      document: doc.results,
    };
  },
};
</script>
<style></style>
