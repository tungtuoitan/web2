import React, { useEffect, useRef } from 'react';
// import './Cube3D.css'; // 👈 chứa CSS

const Cube3D: React.FC = () => {
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let angleX = 0;
    let angleY = 0;
    let animationFrameId: number;

    const animate = () => {
      angleX += 0.5;
      angleY += 0.5;

      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="scene">
      <div className="cube" ref={cubeRef}>
        <div className="face front">Front</div>
        <div className="face back">Back</div>
        <div className="face right">Right</div>
        <div className="face left">Left</div>
        <div className="face top">Top</div>
        <div className="face bottom">Bottom</div>
      </div>
    </div>
  );
};

export default Cube3D;
