import { buildReportSections } from "../utils/report";

it("includes selected sections", () => {
  const sections = buildReportSections("周报", ["ndvi", "timeline"]);
  const ids = sections.map((section) => section.id);
  expect(ids).toContain("ndvi");
  expect(ids).toContain("timeline");
});
