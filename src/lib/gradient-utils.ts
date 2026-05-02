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
  
  // Calculate gradient points
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

  // 1. Draw Base Background (Solid background color first to avoid transparency issues)
  ctx.fillStyle = '#f6f3f8'; // Matches --background
  ctx.fillRect(0, 0, width, height);

  // 2. Soft Background Glow (replicating the opacity-20 blur-100px glow)
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.filter = 'blur(100px)';
  ctx.fillStyle = createGradient(x0, y0, x1, y1);
  ctx.fillRect(-200, -200, width + 400, height + 400);
  ctx.restore();

  // 3. Draw Dotted Grid (replicating the UI dot grid)
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#000000';
  const dotSpacing = 64; // Scaled up for 2000x2000
  for (let x = 0; x <= width; x += dotSpacing) {
    for (let y = 0; y <= height; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 4. Draw The Liquid Orb Area
  const orbRadius = width * 0.375;
  
  // Orb Background Glow (the blur-3xl glow)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalAlpha = 0.3;
  ctx.filter = 'blur(60px)';
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
  
  // Draw the gradient inside (Slightly rotated back for the iridescence feel)
  ctx.rotate(15 * Math.PI / 180);
  // Apply a slight "warp" feel by using a custom filter if supported or just rich gradients
  try {
    // Attempting to match the displacement look
    ctx.filter = 'contrast(1.1) brightness(1.05)';
  } catch (e) {}

  ctx.fillStyle = createGradient(-orbRadius, -orbRadius, orbRadius, orbRadius);
  ctx.fillRect(-orbRadius * 1.2, -orbRadius * 1.2, orbRadius * 2.4, orbRadius * 2.4);
  
  // Inner highlights (Glass effect)
  const highlight = ctx.createRadialGradient(
    -orbRadius * 0.3, -orbRadius * 0.3, 0,
    -orbRadius * 0.3, -orbRadius * 0.3, orbRadius * 0.9
  );
  highlight.addColorStop(0, 'rgba(255,255,255,0.4)');
  highlight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlight;
  ctx.fillRect(-orbRadius, -orbRadius, orbRadius * 2, orbRadius * 2);

  // Bottom shadow highlight
  const darkHighlight = ctx.createRadialGradient(
    orbRadius * 0.4, orbRadius * 0.4, 0,
    orbRadius * 0.4, orbRadius * 0.4, orbRadius * 0.7
  );
  darkHighlight.addColorStop(0, 'rgba(0,0,0,0.15)');
  darkHighlight.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = darkHighlight;
  ctx.fillRect(-orbRadius, -orbRadius, orbRadius * 2, orbRadius * 2);

  // Surface reflection
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  // 5. Final Download
  const link = document.createElement('a');
  link.download = `linearhue-design-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
