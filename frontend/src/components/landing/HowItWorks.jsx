import { motion } from 'framer-motion';
import { MapPin, Shield, MessageCircle, Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MapPin,
    title: 'Choose your city',
    description: 'Select from available cities to find your local community. New cities added every month.',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    details: ['5 cities live now', 'New city every month', 'Your neighborhood matters'],
  },
  {
    number: '02',
    icon: Shield,
    title: 'Get your identity',
    description: 'We generate a unique anonymous persona. No real names, no phone numbers, no tracking.',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
    details: ['Instant generation', 'No personal data', 'Fully anonymous'],
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Start connecting',
    description: 'Join communities, chat with people, build real connections. No identity required.',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    details: ['Real conversations', 'Real people', 'Real connections'],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const stepVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600 mb-4">
            <Check className="w-3.5 h-3.5" />
            How it Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink tracking-tight mb-4">
            Up and running in minutes
          </h2>
          <p className="text-gray-500 text-lg max-w-lg">
            Three simple steps to start connecting with your city.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={stepVariant}
                whileHover={{ y: -4 }}
                className={`group relative rounded-2xl border border-gray-200/60 bg-white overflow-hidden transition-all duration-300 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/40 ${
                  index === 1 ? 'md:scale-[1.02] md:z-10' : ''
                }`}
              >
                <div className={`h-1 bg-gradient-to-r ${step.color}`} />

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${step.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${step.textColor}`} />
                    </div>
                    <span className="text-7xl font-display font-bold text-gray-100 select-none leading-none">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-ink mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">{step.description}</p>

                  <div className="space-y-2.5">
                    {step.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <Check className={`w-3 h-3 ${step.textColor}`} />
                        </div>
                        <span className="text-sm text-gray-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
