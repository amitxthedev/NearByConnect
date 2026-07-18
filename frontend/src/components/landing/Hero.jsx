import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Check, MessageCircle, Users, Hash, Code, Send, Smile, Lock } from 'lucide-react';
import Button from '../ui/Button';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
};

function Avatar({ src, name, color = 'bg-pink-500', size = 'w-10 h-10' }) {
  if (src) {
    return (
      <div className={`${size} rounded-full overflow-hidden shrink-0`}>
        <img src={src} alt={name} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }
  const initials = name.split('-')[0]?.[0] || '?';
  return (
    <div className={`${size} ${color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  );
}

const messages = [
  {
    name: 'Wolf-8821', color: 'bg-violet-500',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    text: "Hey everyone, has anyone tried the new API endpoint? I keep getting 403 errors on the auth middleware.",
    time: '2:34 PM', sent: false,
  },
  {
    name: 'You', color: 'bg-pink-500',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    text: "Yeah, you need to pass the bearer token in the header now. They deprecated query params last week.",
    time: '2:35 PM', sent: true,
  },
  {
    name: 'Panda-1292', color: 'bg-emerald-500',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    text: "I pushed a fix to the staging branch. Can someone review?",
    time: '2:36 PM', sent: false,
  },
  {
    name: 'Wolf-8821', color: 'bg-violet-500',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    text: "Also, who is up for board games night on Friday?",
    time: '2:38 PM', sent: false,
  },
  {
    name: 'You', color: 'bg-pink-500',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    text: "Count me in! I will bring snacks.",
    time: '2:39 PM', sent: true,
  },
];

const channels = [
  { name: 'general', icon: Hash, active: false, unread: 0 },
  { name: 'code-collective', icon: Code, active: true, unread: 3 },
  { name: 'music-scene', active: false, unread: 0, icon: MessageCircle },
  { name: 'gaming-hub', active: false, unread: 12, icon: MessageCircle },
];

const dmUsers = [
  { name: 'Fox-7281', color: 'bg-orange-500', status: 'online', src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' },
  { name: 'Wolf-8821', color: 'bg-violet-500', status: 'online', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { name: 'Panda-1292', color: 'bg-emerald-500', status: 'away', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
];

const onlineMembers = [
  { name: 'Fox-7281', color: 'bg-orange-500', role: 'Admin', src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' },
  { name: 'Wolf-8821', color: 'bg-violet-500', role: 'Mod', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { name: 'Panda-1292', color: 'bg-emerald-500', role: '', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
  { name: 'Eagle-5501', color: 'bg-blue-500', role: '', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face' },
];

function AppPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[1000px]">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-pink-500/8 via-transparent to-rose-500/5 blur-2xl pointer-events-none" />

      <div className="relative rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5 bg-gray-50/80">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[11px] text-gray-400">
            <Lock className="w-3 h-3" />
            nearbyconnect.fun/app
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-1 text-[10px] text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              12 online
            </div>
            <span className="rounded-md bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 text-[11px] font-medium text-white shadow-lg shadow-pink-500/20">Live</span>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_200px] min-h-[380px] sm:min-h-[440px]">
          {/* Left sidebar */}
          <aside className="hidden md:flex flex-col border-r border-gray-100 bg-gray-50/30">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
              <img src="/brandlogo.png" alt="NearbyConnect" className="w-7 h-7 rounded-lg object-contain" />
              <div>
                <div className="text-[11px] font-bold text-gray-900">NearbyConnect</div>
                <div className="text-[9px] text-gray-400">Durgapur</div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden px-2 py-2 space-y-3">
              <div>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Channels</span>
                </div>
                <div className="space-y-0.5">
                  {channels.map((ch) => (
                    <div key={ch.name} className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-colors ${
                      ch.active ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-500 hover:bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <ch.icon className="w-3 h-3" strokeWidth={2} />
                        <span>{ch.name}</span>
                      </div>
                      {ch.unread > 0 && (
                        <span className="min-w-[16px] h-4 rounded-full bg-pink-500 text-[8px] font-bold text-white flex items-center justify-center px-1">
                          {ch.unread}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="px-2 mb-1.5">
                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Direct Messages</span>
                </div>
                <div className="space-y-0.5">
                  {dmUsers.map((u) => (
                    <div key={u.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] text-gray-500 hover:bg-gray-100">
                      <div className="relative shrink-0">
                        <Avatar name={u.name} color={u.color} size="w-5 h-5" src={u.src} />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-[1.5px] border-gray-50 ${
                          u.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`} />
                      </div>
                      <span className="truncate">{u.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-3 py-2.5 flex items-center gap-2">
              <div className="relative">
                <Avatar name="Fox-7281" color="bg-orange-500" size="w-7 h-7" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-[1.5px] border-gray-50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-gray-700 truncate">Fox-7281</div>
                <div className="text-[8px] text-gray-400">Online</div>
              </div>
            </div>
          </aside>

          {/* Main chat area */}
          <main className="relative flex flex-col bg-white">
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2.5">
              <span className="text-[12px] font-mono text-gray-300">#</span>
              <span className="text-[12px] font-semibold text-gray-800">code-collective</span>
              <div className="w-px h-3 bg-gray-200 mx-1" />
              <span className="text-[11px] text-gray-400 hidden sm:inline truncate">Developers sharing code, asking questions, and building together</span>
              <div className="ml-auto flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-300" />
              </div>
            </div>

            <div className="flex-1 overflow-hidden px-4 py-3 space-y-4">
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[9px] font-medium text-gray-300 uppercase tracking-wider">Today</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 items-start ${msg.sent ? 'justify-end' : ''}`}>
                  {!msg.sent && (
                    <Avatar name={msg.name} color={msg.color} size="w-8 h-8" src={msg.src} />
                  )}
                  <div className={`max-w-[75%] ${msg.sent ? 'text-right' : ''}`}>
                    {!msg.sent && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-bold text-gray-700">{msg.name}</span>
                        <span className="text-[9px] text-gray-300">{msg.time}</span>
                      </div>
                    )}
                    <div className={`rounded-2xl px-3.5 py-2 text-[11px] leading-relaxed inline-block ${
                      msg.sent
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-tr-md shadow-sm'
                        : 'bg-gray-100 text-gray-700 rounded-tl-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <Avatar name="Panda-1292" color="bg-emerald-500" size="w-5 h-5" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" />
                <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[9px] text-gray-300">Panda-1292 is typing...</span>
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-pink-300 focus-within:bg-white transition-colors">
                <Smile className="w-4 h-4 text-gray-300 shrink-0" />
                <span className="text-[12px] text-gray-400 flex-1">Message #code-collective</span>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
                  <Send className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </main>

          {/* Right panel */}
          <aside className="hidden md:flex flex-col border-l border-gray-100 bg-gray-50/30">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-500">
                <Users className="w-3 h-3" />
                Members
              </div>
              <span className="text-[10px] text-gray-400">8</span>
            </div>

            <div className="flex-1 overflow-hidden px-2 py-2 space-y-3">
              <div>
                <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1.5">Online — 6</div>
                <div className="space-y-0.5">
                  {onlineMembers.map((u) => (
                    <div key={u.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="relative shrink-0">
                        <Avatar name={u.name} color={u.color} size="w-6 h-6" src={u.src} />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-[1.5px] border-gray-50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-gray-700 truncate">{u.name}</div>
                      </div>
                      {u.role && (
                        <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${
                          u.role === 'Admin' ? 'bg-pink-100 text-pink-600' : 'bg-violet-100 text-violet-600'
                        }`}>
                          {u.role}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-1 rounded-xl border border-gray-200 bg-white p-3 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                    <Code className="w-4 h-4 text-pink-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-gray-700">Code Collective</div>
                    <div className="text-[9px] text-gray-400">2,847 members</div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {['JavaScript', 'React', 'Python'].map((tag) => (
                    <span key={tag} className="text-[8px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-3 py-2.5">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-[9px] text-emerald-600 font-medium">End-to-end encrypted</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 noise" style={{ zIndex: 0 }} />
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-pink-400/[0.06] rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 w-full pt-20 lg:pt-28 pb-12 flex flex-col items-center">

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl mb-12 lg:mb-16"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-pink-50 px-4 py-1.5 text-xs font-medium text-pink-600">
              <MessageCircle className="w-3.5 h-3.5" />
              Anonymous local communities
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] font-display font-extrabold tracking-tight leading-[1.02] mb-6"
          >
            <span className="text-ink">Talk to your city.</span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">Stay anonymous.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 max-w-lg mx-auto"
          >
            Meet real people in your neighborhood without giving up your name. Join a community, start chatting, show up.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" className="px-9 text-base">
                Get started free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg" className="px-9 text-base">
                See features
              </Button>
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-pink-500" />
              No real name required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-pink-500" />
              Free forever
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-pink-500" />
              End-to-end encrypted
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3 justify-center">
            <div className="flex -space-x-2">
              {[
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
              ].map((src, i) => (
                <div key={i} className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden" style={{ zIndex: 4 - i }}>
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-ink">10,000+</span> people already here
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="w-full"
        >
          <AppPreview />
        </motion.div>

      </div>
    </section>
  );
}
