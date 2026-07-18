import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Card({ className, hover = true, glass = false, children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' } : undefined}
      className={cn(
        'rounded-2xl bg-white border border-slate-100 p-6 transition-all duration-300',
        glass && 'glass',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
