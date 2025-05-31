import React, { useRef, useEffect } from "react";

const FisheyeLensCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/sample.jpg"; // ảnh của bạn
    imageRef.current = img;

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

    // Add text "xxx" with font size 8px
    ctx.font = "8px sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText("xxx", 10, 20);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    img.onload = () => {
      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
      //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const radius = 60; // bán kính gương
      const scale = 1.8; // độ phóng đại

      if (!imageRef.current) return;

      // Redraw background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

      // Capture vùng ảnh quanh chuột
      const sx = mouseX - radius;
      const sy = mouseY - radius;
      const sWidth = radius * 2;
      const sHeight = radius * 2;

      const dx = mouseX - radius * scale;
      const dy = mouseY - radius * scale;
      const dWidth = sWidth * scale;
      const dHeight = sHeight * scale;

      // Tạo clip hình tròn
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Vẽ vùng ảnh bị phóng đại
      ctx.drawImage(
        imageRef.current,
        sx * (imageRef.current.width / canvas.width),
        sy * (imageRef.current.height / canvas.height),
        sWidth * (imageRef.current.width / canvas.width),
        sHeight * (imageRef.current.height / canvas.height),
        dx,
        dy,
        dWidth,
        dHeight
      );

      ctx.restore();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1912}
      height={924}
      style={{
        // border: "1px solid red", cursor: "none",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default FisheyeLensCanvas;
