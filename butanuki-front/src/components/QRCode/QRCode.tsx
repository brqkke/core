import qrcode from "qrcode";
import { useEffect, useRef } from "react";

export default function QRCodeDisplay({ url }: { url: string }) {
  const canvaRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvaRef.current) {
      qrcode.toCanvas(canvaRef.current, url, (error) => {
        if (error) console.error(error);
      });
    }
  });
  return <canvas ref={canvaRef} />;
}
