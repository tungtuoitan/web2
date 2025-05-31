import React, { useRef, useEffect } from "react";

const EraserCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/sample.jpg";

    img.onload = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgWidth = img.width;
      const imgHeight = img.height;
        
      // 🧠 Tính tỉ lệ để giữ nguyên tỉ lệ ảnh
      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      // 🎯 Căn trái – trên cùng
      const dx = 0;
      const dy = 0;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.filter = "blur(20px)";
      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

      const handleErase = (e: MouseEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2); // Eraser radius 20px
        ctx.fill();
        ctx.globalCompositeOperation = "source-over"; // reset
      };

      canvas.addEventListener("mousemove", handleErase);

      return () => {
        canvas.removeEventListener("mousemove", handleErase);
      };
    };
  }, []);

  return (
    <div
      style={{
        backgroundImage: "url('/sample.jpg')",
        // backgroundSize: "cover",
        backgroundPosition: "left top",
        width: "1912px",
        height: "924px",
        position: "relative",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain", // ⬅️ giữ nguyên tỉ lệ
      }}
    >
      {/* <canvas
        ref={canvasRef}
        width={1912}
        height={924}
        style={{
          display: "block",
          borderRadius: "16px",
          boxShadow: "0 4px 30px white",
          border: "1px solid white",
          background: "transparent",
          position: "absolute",
          //   opacity: 0.5,
          top: 0,
          left: 0,
        }}
      /> */}
    </div>
  );
};

export default EraserCanvas;
