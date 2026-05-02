
import { GradientEditor } from '@/components/gradient-editor';
import { Palette } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen font-body p-4 md:p-8 lg:p-12 selection:bg-primary/20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                <Palette className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-headline font-black tracking-tighter text-foreground">
                Linear<span className="text-primary">Hue</span>
              </h1>
            </div>
            <p className="text-muted-foreground max-w-md text-lg">
              Craft beautiful, production-ready linear gradients for your next digital masterpiece.
            </p>
          </div>
          
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Version 1.0</span>
            <span className="text-sm font-medium text-primary">Made for creators</span>
          </div>
        </header>

        {/* Editor Area */}
        <section className="relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <GradientEditor />
        </section>

        {/* Footer info */}
        <footer className="pt-12 text-center text-sm text-muted-foreground animate-fade-in">
          <p>© {new Date().getFullYear()} LinearHue. Design with purpose.</p>
        </footer>
      </div>
    </main>
  );
}
