"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
}

export default function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const maxDistance = 140;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.45),
        vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.45),
        size: Math.random() * 1.8 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.3,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to mouse if near
        const mouseDx = p1.x - mouseX;
        const mouseDy = p1.y - mouseY;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        if (mouseDist < 160) {
          const alpha = (1 - mouseDist / 160) * 0.28;
          ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }

        // Draw node
        ctx.fillStyle = `rgba(16, 185, 129, ${p1.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        if (!prefersReducedMotion) {
          p1.x += p1.vx;
          p1.y += p1.vy;

          if (p1.x < 0) p1.x = width;
          else if (p1.x > width) p1.x = 0;
          if (p1.y < 0) p1.y = height;
          else if (p1.y > height) p1.y = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-45"
      aria-hidden="true"
    />
  );
}
