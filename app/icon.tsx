import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#7B1A1A",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          fontFamily: "sans-serif",
        }}
      >
        LF
      </div>
    ),
    { ...size }
  );
}
