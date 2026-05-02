
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

  // Linear gradient in Canvas is different from CSS angle.
  // CSS 0deg is bottom to top. 90deg is left to right.
  // Canvas linear gradient uses (x0, y0, x1, y1).
  
  const angleRad = (angle - 90) * (Math.PI / 180);
  
  const cx = width / 2;
  const cy = height / 2;
  
  // Calculate distance to corners to ensure gradient covers the whole canvas
  const length = Math.abs(width * Math.cos(angleRad)) + Math.abs(height * Math.sin(angleRad));
  
  const x0 = cx - Math.cos(angleRad) * (length / 2);
  const y0 = cy - Math.sin(angleRad) * (length / 2);
  const x1 = cx + Math.cos(angleRad) * (length / 2);
  const y1 = cy + Math.sin(angleRad) * (length / 2);

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  sortedStops.forEach((stop) => {
    gradient.addColorStop(stop.position / 100, stop.color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const link = document.createElement('a');
  link.download = `linearhue-gradient-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
