import { useEffect, useRef } from "react";

const InteractiveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Particle system
    const particles = [];
    const particleCount = 80;
    const connectionDistance = 150;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    // Mouse position
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;
      setTimeout(() => {
        isMouseMoving = false;
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(15, 23, 42, 0.95)");
      gradient.addColorStop(0.5, "rgba(30, 41, 59, 0.95)");
      gradient.addColorStop(1, "rgba(15, 23, 42, 0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glow effect
      const glowGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      glowGradient.addColorStop(0, "rgba(0, 217, 255, 0.05)");
      glowGradient.addColorStop(1, "rgba(0, 217, 255, 0)");
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Mouse interaction
        if (isMouseMoving) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            particle.vx -= dx * 0.00005;
            particle.vy -= dy * 0.00005;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 217, 255, 0.8)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0, 217, 255, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default InteractiveBackground;
