import { NavLink } from 'react-router-dom';
import { Home, Users, MessageSquare, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const tabs = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-100">
      <div className="flex items-center justify-around h-16 px-1 safe-area-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[64px]',
                  isActive
                    ? 'text-pink-600'
                    : 'text-gray-400 active:text-gray-600'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-all duration-200',
                        isActive && 'scale-110'
                      )}
                    />
                    {isActive && (
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-[2.5px] bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] transition-all duration-200',
                      isActive ? 'font-semibold' : 'font-medium'
                    )}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
