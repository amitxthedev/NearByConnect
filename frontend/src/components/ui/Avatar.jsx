import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

const emojiSizeMap = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
  xl: 'text-4xl',
};

const colorMap = [
  'from-pink-400 to-rose-500',
  'from-violet-400 to-purple-500',
  'from-blue-400 to-cyan-500',
  'from-emerald-400 to-teal-500',
  'from-orange-400 to-red-500',
  'from-amber-400 to-yellow-500',
];

export default function Avatar({ src, name, emoji, size = 'md', className, online }) {
  const colorIndex = name ? name.charCodeAt(0) % colorMap.length : 0;

  return (
    <div className={cn('relative shrink-0', className)}>
      {src ? (
        <img src={src} alt={name} className={cn('rounded-full object-cover', sizeMap[size])} />
      ) : emoji ? (
        <div className={cn(
          'rounded-full flex items-center justify-center bg-gradient-to-br',
          sizeMap[size],
          colorMap[colorIndex]
        )}>
          <span className={emojiSizeMap[size]}>{emoji}</span>
        </div>
      ) : (
        <div className={cn(
          'rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br',
          sizeMap[size],
          colorMap[colorIndex]
        )}>
          {name ? (
            <span className={cn('font-bold', size === 'xs' || size === 'sm' ? 'text-xs' : 'text-sm')}>
              {name.split('-')[0]?.charAt(0)?.toUpperCase() || '?'}
            </span>
          ) : (
            <User className={cn(size === 'xs' || size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
          )}
        </div>
      )}
      {online !== undefined && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-white',
          online ? 'bg-emerald-400' : 'bg-slate-300',
          size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
        )} />
      )}
    </div>
  );
}
