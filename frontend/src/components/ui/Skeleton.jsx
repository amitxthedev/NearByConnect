import { cn } from '../../utils/cn';

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200', className)}
      {...props}
    />
  );
}

export function PostSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
      <Skeleton className="w-3/4 h-5" />
      <Skeleton className="w-full h-20" />
      <div className="flex gap-4">
        <Skeleton className="w-16 h-8" />
        <Skeleton className="w-16 h-8" />
        <Skeleton className="w-16 h-8" />
      </div>
    </div>
  );
}

export function CommunitySkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 space-y-3">
      <Skeleton className="w-full h-32 rounded-xl" />
      <Skeleton className="w-2/3 h-5" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-1/3 h-4" />
    </div>
  );
}
