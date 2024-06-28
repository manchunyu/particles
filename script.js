const ROWS = 175;
const COLS = 250;
const NUM_PARTICLES = ROWS * COLS;
const THICKNESS = Math.pow(80, 2);
const SPACING = 4;
const MARGIN = 100;
const PARTICLE_COLOUR = 255;
const DRAG = 0.95;
const EASE = 1;

let container, canvas, context, particles, mouseX, mouseY, width, height;

const particlePrototype = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
};

function initialise() {
  container = document.getElementById('root');
  canvas = document.createElement('canvas');
  context = canvas.getContext('2d');
  particles = [];

  width = canvas.width = COLS * SPACING + MARGIN * 2;
  height = canvas.height = ROWS * SPACING + MARGIN * 2;

  container.style.marginLeft = `${Math.round(width * -0.5)}px`;
  container.style.marginTop = `${Math.round(height * -0.5)}px`;

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const particle = Object.create(particlePrototype);
    particle.x = particle.ox = MARGIN + SPACING * (i % COLS);
    particle.y = particle.oy = MARGIN + SPACING * Math.floor(i / COLS);
    particles.push(particle);
  }

  container.addEventListener('mousemove', (e) => {
    const bounds = container.getBoundingClientRect();
    mouseX = e.clientX - bounds.left;
    mouseY = e.clientY - bounds.top;
  });

  container.appendChild(canvas);
}

function updateParticles() {
  for (const particle of particles) {
    const dx = mouseX - particle.x;
    const dy = mouseY - particle.y;
    const distanceSquared = dx * dx + dy * dy;
    const force = -THICKNESS / distanceSquared;

    if (distanceSquared < THICKNESS) {
      const angle = Math.atan2(dy, dx);
      particle.vx += force * Math.cos(angle);
      particle.vy += force * Math.sin(angle);
    }

    particle.vx *= DRAG;
    particle.vy *= DRAG;
    particle.x += particle.vx + (particle.ox - particle.x) * EASE;
    particle.y += particle.vy + (particle.oy - particle.y) * EASE;
  }
}

function renderParticles() {
  const imageData = context.createImageData(width, height);
  const data = imageData.data;

  for (const particle of particles) {
    const index = (Math.floor(particle.x) + Math.floor(particle.y) * width) * 4;
    data[index] = data[index + 1] = data[index + 2] = PARTICLE_COLOUR;
    data[index + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);
}

function animationFrame() {
  updateParticles();
  renderParticles();
  window.requestAnimationFrame(animationFrame);
}

initialise();
animationFrame();
