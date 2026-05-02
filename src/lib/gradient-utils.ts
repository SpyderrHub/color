export type ColorStop = {
  id: string;
  color: string;
  position: number; // 0 to 100
};

export function generateGradientCSS(stops: ColorStop[], angle: number): string {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');
  return `linear-gradient(${angle}deg, ${stopsStr})`;
}

export function generateRandomColor(): string {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return `#${hex.padStart(6, '0')}`;
}

export async function downloadGradientAsPNG(
  stops: ColorStop[],
  angle: number,
  width: number = 2000,
  height: number = 2000
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  const angleRad = (angle - 90) * (Math.PI / 180);
  const cx = width / 2;
  const cy = height / 2;
  
  const length = Math.abs(width * Math.cos(angleRad)) + Math.abs(height * Math.sin(angleRad));
  const x0 = cx - Math.cos(angleRad) * (length / 2);
  const y0 = cy - Math.sin(angleRad) * (length / 2);
  const x1 = cx + Math.cos(angleRad) * (length / 2);
  const y1 = cy + Math.sin(angleRad) * (length / 2);

  const createGradient = (xS: number, yS: number, xE: number, yE: number) => {
    const g = ctx.createLinearGradient(xS, yS, xE, yE);
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    sortedStops.forEach((stop) => {
      g.addColorStop(stop.position / 100, stop.color);
    });
    return g;
  };

  // 1. Draw Background
  ctx.fillStyle = createGradient(x0, y0, x1, y1);
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Subtle Grid (Technical Feel)
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  const step = 60;
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Draw The Liquid Orb
  const orbRadius = width * 0.35;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-15 * Math.PI / 180); // Match UI rotation
  
  // Orb Glow/Shadow
  ctx.shadowBlur = 100;
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  
  // Orb Base (The Gradient)
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
  ctx.clip();
  
  // Draw the gradient inside the orb (slightly offset for "liquid" look)
  ctx.rotate(15 * Math.PI / 180); // Reset rotation for inner gradient
  ctx.fillStyle = createGradient(-orbRadius, -orbRadius, orbRadius, orbRadius);
  ctx.fillRect(-orbRadius * 1.5, -orbRadius * 1.5, orbRadius * 3, orbRadius * 3);
  
  // Inner highlights (Glass effect)
  const highlight = ctx.createRadialGradient(
    -orbRadius * 0.3, -orbRadius * 0.3, 0,
    -orbRadius * 0.3, -orbRadius * 0.3, orbRadius * 0.8
  );
  highlight.addColorStop(0, 'rgba(255,255,255,0.4)');
  highlight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlight;
  ctx.fillRect(-orbRadius, -orbRadius, orbRadius * 2, orbRadius * 2);

  // Bottom shadow highlight
  const darkHighlight = ctx.createRadialGradient(
    orbRadius * 0.4, orbRadius * 0.4, 0,
    orbRadius * 0.4, orbRadius * 0.4, orbRadius * 0.6
  );
  darkHighlight.addColorStop(0, 'rgba(0,0,0,0.1)');
  darkHighlight.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = darkHighlight;
  ctx.fillRect(-orbRadius, -orbRadius, orbRadius * 2, orbRadius * 2);

  ctx.restore();

  // Download
  const link = document.createElement('a');
  link.download = `linearhue-export-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
