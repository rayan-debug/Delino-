import { Monitor, PenTool, PlayCircle, Camera, Sparkles, Compass, Layers, Briefcase, type LucideIcon } from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  monitor: Monitor, pen: PenTool, play: PlayCircle, camera: Camera,
  sparkles: Sparkles, compass: Compass, layers: Layers, briefcase: Briefcase,
};

export default function ServiceIcon({ name = 'monitor', size = 28 }: { name?: string; size?: number }) {
  const Icon = MAP[name] ?? Monitor;
  return <Icon size={size} strokeWidth={1.25} />;
}
