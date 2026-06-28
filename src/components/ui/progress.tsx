import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function Progress({ value, className, showLabel }: ProgressProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

interface UploadProgressProps {
  fileName: string;
  progress: number;
  className?: string;
}

export function UploadProgress({ fileName, progress, className }: UploadProgressProps) {
  return (
    <div className={cn("space-y-2 p-3 rounded-xl bg-muted/50", className)}>
      <div className="flex justify-between text-sm">
        <span className="truncate font-medium">{fileName}</span>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
