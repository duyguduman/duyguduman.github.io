const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const canvas = document.getElementById("neural-bg");
const ctx = canvas ? canvas.getContext("2d") : null;

let particles = [];
let width;
let height;

function resizeCanvas() {
  if (!canvas || !ctx) return;

  width = window.innerWidth;
  height = window.innerHeight;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createParticles();
}

function createParticles() {
  const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 18000);

  particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    radius: Math.random() * 1.8 + 0.8
  }));
}

function drawNeuralBackground() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(110, 231, 255, 0.75)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];

      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 140) {
        const opacity = 1 - distance / 140;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawNeuralBackground);
}

if (canvas && ctx) {
  resizeCanvas();
  drawNeuralBackground();
  window.addEventListener("resize", resizeCanvas);
}
