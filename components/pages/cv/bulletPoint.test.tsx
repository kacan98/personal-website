import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { CvBulletPoint } from "./bulletPoint";
import { makeStore } from "@/redux/store";
import { CVSettings } from "@/types";

vi.mock("@/components/icon", () => ({
  SUPPORTED_ICONS: {
    link: {
      component: () => <span data-testid="icon" />,
    },
  },
}));

const baseCvSettings: CVSettings = {
  on: true,
  name: "Test User",
  subtitle: "Developer",
  mainColumn: [],
  sideColumn: [],
  profilePicture: null,
};

function renderPrintBulletPoint(url: string, text: string) {
  return render(
    <Provider store={makeStore(baseCvSettings)}>
      <CvBulletPoint
        bulletPoint={{
          id: "bullet-1",
          iconName: "link",
          text,
          url,
          description: null,
        }}
        baseQuery={["mainColumn", 0, "bulletPoints"]}
        isPrintVersion
      />
    </Provider>
  );
}

describe("CvBulletPoint print links", () => {
  it("renders work example links as absolute anchors in print mode", () => {
    renderPrintBulletPoint(
      "https://portfolio.example.com/en/projects/developer-task-overview-dashboard",
      "Developer Task Overview Dashboard"
    );

    const link = screen.getByRole("link", { name: "Developer Task Overview Dashboard" });
    expect(link).toHaveAttribute(
      "href",
      "https://portfolio.example.com/en/projects/developer-task-overview-dashboard"
    );
  });

  it("renders contact links as anchors in print mode", () => {
    renderPrintBulletPoint("https://github.com/kacan98", "github.com/kacan98");

    const link = screen.getByRole("link", { name: "github.com/kacan98" });
    expect(link).toHaveAttribute("href", "https://github.com/kacan98");
  });
});
