
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

export async function downloadDesign(
  stops: ColorStop[],
  angle: number,
  size: number = 1024
) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  const angleRad = (angle - 90) * (Math.PI / 180);
  const cx = size / 2;
  const cy = size / 2;
  
  // Calculate gradient coordinates based on angle
  const length = Math.abs(size * Math.cos(angleRad)) + Math.abs(size * Math.sin(angleRad));
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

  // 1. Draw Base Background (Fill with solid color for JPEG compatibility)
  ctx.fillStyle = '#f6f3f8';
  ctx.fillRect(0, 0, size, size);

  // 2. Soft Background Glow
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.filter = 'blur(80px)';
  ctx.fillStyle = createGradient(x0, y0, x1, y1);
  ctx.fillRect(-size * 0.2, -size * 0.2, size * 1.4, size * 1.4);
  ctx.restore();

  // 3. Draw Dotted Grid
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#000000';
  const dotSpacing = size * (32 / 512);
  const dotRadius = size * (1.2 / 512);
  for (let x = 0; x <= size; x += dotSpacing) {
    for (let y = 0; y <= size; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 4. Draw The Liquid Orb Area
  const orbRadius = size * 0.375;
  
  // Orb Background Glow
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalAlpha = 0.3;
  ctx.filter = 'blur(50px)';
  ctx.fillStyle = createGradient(-orbRadius, -orbRadius, orbRadius, orbRadius);
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius * 1.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // The Main Orb with Displacement Mapping
  ctx.save();
  ctx.translate(cx, cy);
  
  // Reference the SVG filter from the DOM
  ctx.filter = 'url(#liquid-warpage) brightness(1.05) contrast(1.1)';
  
  ctx.save();
  ctx.rotate(-15 * Math.PI / 180);
  
  // Draw orb
  ctx.fillStyle = createGradient(-orbRadius, -orbRadius, orbRadius, orbRadius);
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Reset filter for highlights
  ctx.filter = 'none';

  // Top-Left Highlight
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.filter = 'blur(40px)';
  const tlHighlight = ctx.createLinearGradient(-orbRadius, -orbRadius, 0, 0);
  tlHighlight.addColorStop(0, '#ffffff');
  tlHighlight.addColorStop(1, 'transparent');
  ctx.fillStyle = tlHighlight;
  ctx.beginPath();
  ctx.arc(-orbRadius * 0.2, -orbRadius * 0.2, orbRadius * 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Bottom-Right Shadow
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.filter = 'blur(25px)';
  const brShadow = ctx.createLinearGradient(orbRadius, orbRadius, 0, 0);
  brShadow.addColorStop(0, '#000000');
  brShadow.addColorStop(1, 'transparent');
  ctx.fillStyle = brShadow;
  ctx.beginPath();
  ctx.arc(orbRadius * 0.3, orbRadius * 0.3, orbRadius * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Inner border & glass shadow
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = size * (1 / 512);
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Inset Glow
  const insetGlow = ctx.createRadialGradient(0, 0, orbRadius * 0.85, 0, 0, orbRadius);
  insetGlow.addColorStop(0, 'transparent');
  insetGlow.addColorStop(1, 'rgba(255,255,255,0.15)');
  ctx.fillStyle = insetGlow;
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // 5. Final Download as JPEG
  const link = document.createElement('a');
  link.download = `linearhue-design-${Date.now()}.jpg`;
  link.href = canvas.toDataURL('image/jpeg', 0.85); // High quality but compressed JPEG
  link.click();
}
