import { renderToStaticMarkup } from "react-dom/server";
import ConceptsIndexPage from "@/app/(concepts)/concepts/page";

describe("concepts index page", () => {
  it("lists links to all three homepage concept previews", () => {
    const html = renderToStaticMarkup(<ConceptsIndexPage />);

    expect(html).toContain("/concepts/monograph");
    expect(html).toContain("/concepts/gridline");
    expect(html).toContain("/concepts/blueprint");
    expect(html).toContain("/concepts/panorama");
    expect(html).toContain("Homepage concept directions for AgentFlow");
  });
});
