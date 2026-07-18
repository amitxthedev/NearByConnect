import { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

function generateCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < len; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function drawCaptcha(canvas, code) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 30; i++) {
    ctx.strokeStyle = `rgba(${150 + Math.random() * 100}, ${150 + Math.random() * 100}, ${150 + Math.random() * 100}, 0.5)`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * w, Math.random() * h);
    ctx.lineTo(Math.random() * w, Math.random() * h);
    ctx.stroke();
  }

  const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#6366f1'];
  const fontSizes = [18, 20, 22, 24];
  for (let i = 0; i < code.length; i++) {
    ctx.save();
    const x = 18 + i * 28;
    const y = h / 2 + (Math.random() * 10 - 5);
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.font = `bold ${fontSizes[i % fontSizes.length]}px monospace`;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }

  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
    ctx.fill();
  }
}

export default function Captcha({ onVerify }) {
  const canvasRef = useRef(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const refresh = useCallback(() => {
    const newCode = generateCode();
    setCode(newCode);
    setInput('');
    setError('');
    setVerified(false);
    onVerify(false);
    requestAnimationFrame(() => {
      if (canvasRef.current) drawCaptcha(canvasRef.current, newCode);
    });
  }, [onVerify]);

  useEffect(() => {
    refresh();
  }, []);

  const handleVerify = () => {
    if (input === code) {
      setVerified(true);
      setError('');
      onVerify(true);
    } else {
      setError('Incorrect code');
      setVerified(false);
      onVerify(false);
      refresh();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Captcha</label>
      <div className="flex items-center gap-2">
        <canvas
          ref={canvasRef}
          width={200}
          height={50}
          className="rounded-xl border border-gray-200 h-[50px] w-[200px]"
        />
        <button
          type="button"
          onClick={refresh}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
          title="Refresh captcha"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(''); }}
          placeholder="Type the code above"
          maxLength={6}
          className={`flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border transition-all ${
            error ? 'border-red-300' : verified ? 'border-emerald-300' : 'border-gray-100'
          }`}
          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
        />
        <button
          type="button"
          onClick={handleVerify}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all bg-gray-900 text-white hover:bg-gray-800"
        >
          {verified ? 'Verified' : 'Verify'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {verified && <p className="text-xs text-emerald-600 font-medium">Captcha verified</p>}
    </div>
  );
}
