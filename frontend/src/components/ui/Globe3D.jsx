import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

export default function Globe3D({
  markers = [],
  size = 400,
  className = '',
  autoRotateSpeed = 0.3,
}) {
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const phiRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    const cobeMarkers = markers.map((m) => ({
      location: [m.lat, m.lng],
      size: m.size || 0.06,
    }));

    try {
      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: size * 2,
        height: size * 2,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.1, 0.1, 0.12],
        markerColor: [0.95, 0.29, 0.6],
        glowColor: [0.15, 0.15, 0.18],
        markers: cobeMarkers,
        onRender: (state) => {
          state.phi = phiRef.current;
          phiRef.current += autoRotateSpeed / 200;
        },
      });

      setTimeout(() => setIsReady(true), 200);
    } catch (e) {
      console.error('Globe error:', e);
    }

    return () => {
      if (globeRef.current) {
        try { globeRef.current.destroy(); } catch (e) {}
      }
    };
  }, [size, autoRotateSpeed]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full blur-[80px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          opacity: isReady ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      />
    </div>
  );
}
