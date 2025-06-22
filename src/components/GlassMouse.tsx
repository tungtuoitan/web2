import React, { useEffect, useRef } from "react";

const GlassMouse: React.FC = () => {
    const mouseRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            targetPos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMove);

        let animationId: number;
        const animate = () => {
            // Smoothly interpolate position
            mousePos.current.x += (targetPos.current.x - mousePos.current.x) * 0.18;
            mousePos.current.y += (targetPos.current.y - mousePos.current.y) * 0.18;
            if (mouseRef.current) {
                mouseRef.current.style.left = `${mousePos.current.x - 30}px`;
                mouseRef.current.style.top = `${mousePos.current.y - 30}px`;
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("mousemove", handleMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <>
            <style>{`body { cursor: none; }`}</style>
            {/* <div
                ref={mouseRef}
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: 160,
                    height: 160,
                    pointerEvents: "none",
                    borderRadius: "100%",

                    background: "rgba(255,255,255,0.15)",
                    boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
                    border: "5.5px solid rgba(255,255,255,0.4)",
                    backdropFilter: "blur(8px)",
                    zIndex: 9999,
                    transition: "box-shadow 0.2s",
                }}
            /> */}
            <div
                ref={mouseRef}
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: 160,
                    height: 160,
                    pointerEvents: "none",
                    borderRadius: "50%",
                    // background: "transparent",
                    // boxShadow: "0 0 16px 6px rgba(255,255,255,0.5)",
                    // border: "20px solid rgba(255,255,255,0.7)",
                    zIndex: 9999,
                    // transition: "box-shadow 0.2s",
                }}
            >

            {/* <Svg0 /> */}
            {/* <img src="/circle-test1.svg"/> */}
            </div>
        </>
    );
};

export default GlassMouse;