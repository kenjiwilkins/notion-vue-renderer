import { render } from "@testing-library/vue";
import testVue from "./index.vue";
import doc from "./test.json";

describe("testVue", () => {
  it("renders", () => {
    const { getByText } = render(testVue);
    expect(
      getByText(doc.results[0].heading_1.rich_text[0].plain_text)
    ).toBeInTheDocument();
  });
});
