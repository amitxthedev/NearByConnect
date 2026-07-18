import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '#features' },
      { label: 'How it Works', to: '#how-it-works' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Communities', to: '/communities' },
      { label: 'Chat', to: '/chat' },
      { label: 'Search', to: '/search' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Settings', to: '/settings' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="pt-16 pb-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <Link to="/" className="inline-flex items-center gap-2.5 group mb-5">
                <img src="/brandlogo.png" alt="NearbyConnect" className="h-7 object-contain brightness-0 invert" />
              </Link>
              <p className="text-[13px] text-gray-500 leading-relaxed max-w-[220px]">
                Anonymous local communities. Connect with your city without revealing who you are.
              </p>
            </div>

            {columns.map((column) => (
              <div key={column.title} className="col-span-6 sm:col-span-4 md:col-span-2 lg:col-span-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-[13px] text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.06] py-6">
          <p className="text-[12px] text-gray-600 text-center">
            &copy; {new Date().getFullYear()} NearbyConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
