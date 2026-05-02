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
  
  // Calculate gradient coordinates based on angle
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

  // 1. Draw Base Background (Solid Lavender)
  ctx.fillStyle = '#f6f3f8';
  ctx.fillRect(0, 0, width, height);

  // 2. Soft Background Glow (Matches CSS: opacity-20 blur-[100px])
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.filter = 'blur(100px)';
  ctx.fillStyle = createGradient(x0, y0, x1, y1);
  ctx.fillRect(-200, -200, width + 400, height + 400);
  ctx.restore();

  // 3. Draw Dotted Grid (Proportional spacing)
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#000000';
  const dotSpacing = width / 15.6; // Matches 32px spacing on a ~500px wide element
  for (let x = 0; x <= width; x += dotSpacing) {
    for (let y = 0; y <= height; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 4. Draw The Liquid Orb Area
  const orbRadius = width * 0.375; // 75% of container width
  
  // Orb Background Glow (Matches CSS: blur-3xl opacity-30)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalAlpha = 0.3;
  ctx.filter = 'blur(80px)';
  ctx.fillStyle = createGradient(-orbRadius, -orbRadius, orbRadius, orbRadius);
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius * 1.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // The Main Orb
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-15 * Math.PI / 180); // Design rotation
  
  // Create clipping path for the orb
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
  ctx.clip();
  
  // Draw the gradient inside
  ctx.rotate(15 * Math.PI / 180);
  ctx.filter = 'brightness(1.05) contrast(1.1)';
  ctx.fillStyle = createGradient(-orbRadius, -orbRadius, orbRadius, orbRadius);
  ctx.fillRect(-orbRadius * 1.5, -orbRadius * 1.5, orbRadius * 3, orbRadius * 3);
  
  // Top-Left Highlight (Matches CSS: from-white/40 blur-2xl)
  ctx.save();
  ctx.rotate(-15 * Math.PI / 180);
  ctx.globalAlpha = 0.4;
  ctx.filter = 'blur(60px)';
  const tlHighlight = ctx.createLinearGradient(-orbRadius, -orbRadius, 0, 0);
  tlHighlight.addColorStop(0, '#ffffff');
  tlHighlight.addColorStop(1, 'transparent');
  ctx.fillStyle = tlHighlight;
  ctx.fillRect(-orbRadius, -orbRadius, orbRadius * 1.2, orbRadius * 1.2);
  ctx.restore();

  // Bottom-Right Shadow (Matches CSS: from-black/10 blur-xl)
  ctx.save();
  ctx.rotate(-15 * Math.PI / 180);
  ctx.globalAlpha = 0.1;
  ctx.filter = 'blur(40px)';
  const brHighlight = ctx.createLinearGradient(orbRadius, orbRadius, 0, 0);
  brHighlight.addColorStop(0, '#000000');
  brHighlight.addColorStop(1, 'transparent');
  ctx.fillStyle = brHighlight;
  ctx.fillRect(-orbRadius * 0.2, -orbRadius * 0.2, orbRadius * 1.2, orbRadius * 1.2);
  ctx.restore();

  // Inner border & glass shadow (Matches CSS: border-white/30 shadow-inset)
  ctx.save();
  ctx.rotate(-15 * Math.PI / 180);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Inset Shadow Effect
  const insetGlow = ctx.createRadialGradient(0, 0, orbRadius * 0.8, 0, 0, orbRadius);
  insetGlow.addColorStop(0, 'transparent');
  insetGlow.addColorStop(1, 'rgba(255,255,255,0.2)');
  ctx.fillStyle = insetGlow;
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // 5. Final Download
  const link = document.createElement('a');
  link.download = `linearhue-design-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
