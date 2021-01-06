import React, { useEffect, useRef } from "react";
export default function Volume({ changeVolume }) {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width: w, height: h } = canvas;
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "#00ffb1";
    ctx.fill();

    let up = true;
    canvas.onmousedown = (e) => {
      up = false;
    };

    canvas.ontouchstart = () => (up = false);

    const changeBar = (e) => {
      if (!up) {
        var rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const coords = { x: x - rect.left };
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.rect(0, 0, coords.x, h);
        ctx.fill();
        changeVolume(coords.x / ctx.canvas.width);
      }
    };

    canvas.onmousemove = changeBar;
    canvas.ontouchmove = changeBar;

    document.onmouseup = () => (up = true);
  }, []);

  return (
    <div id="volume">
      <canvas ref={canvasRef} />
    </div>
  );
}
