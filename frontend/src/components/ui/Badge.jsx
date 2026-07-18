import { cn } from '../../utils/cn';

const variants = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-pink-100 text-pink-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
};

export default function Badge({ variant = 'default', className, children }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
