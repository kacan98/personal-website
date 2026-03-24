import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-metadata";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.28), transparent 32%), radial-gradient(circle at 85% 22%, rgba(34, 197, 94, 0.22), transparent 28%), linear-gradient(135deg, #050816 0%, #0f172a 55%, #111827 100%)",
          color: "#f8fafc",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#93c5fd",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#38bdf8",
              boxShadow: "0 0 24px rgba(56, 189, 248, 0.6)",
            }}
          />
          Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860 }}>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.02 }}>{SITE_NAME}</div>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#cbd5e1" }}>
            Full-Stack Developer
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: "#94a3b8" }}>{SITE_DESCRIPTION}</div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 22,
            color: "#cbd5e1",
          }}
        >
          <span>TypeScript</span>
          <span>React</span>
          <span>.NET</span>
          <span>Workflow-heavy systems</span>
        </div>
      </div>
    ),
    size
  );
}
