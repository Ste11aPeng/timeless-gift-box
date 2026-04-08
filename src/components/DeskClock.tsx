import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import photo1 from "@/assets/photo-1.png";
import photo2 from "@/assets/photo-2.png";
import photo3 from "@/assets/photo-3.png";
import photo4 from "@/assets/photo-4.png";
import photo5 from "@/assets/photo-5.png";
import photo6 from "@/assets/photo-6.png";
import photo7 from "@/assets/photo-7.png";
import couplePhoto from "@/assets/couple-photo.png";

const fallbackPhotos = [couplePhoto, photo1, photo2, photo3, photo4, photo5, photo6, photo7];

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const playFlipSound = (audioCtx: AudioContext) => {
  const now = audioCtx.currentTime;
  // Paper flip: short noise burst
  const bufferSize = audioCtx.sampleRate * 0.08;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
  }
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3000;
  filter.Q.value = 0.8;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  source.start(now);
  source.stop(now + 0.08);
};

const FlipDate = ({ value, audioCtxRef, isMuted }: { value: string; audioCtxRef: React.MutableRefObject<AudioContext | null>; isMuted: boolean }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setPrevValue(displayValue);
      setIsFlipping(true);
      // Play flip sound
      if (!isMuted) {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        playFlipSound(audioCtxRef.current);
      }
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue, isMuted, audioCtxRef]);

  const cardStyle: React.CSSProperties = {
    width: "104px",
    height: "84px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontSize: "52px",
    fontWeight: 700,
    color: "hsla(30, 10%, 25%, 0.85)",
    position: "relative",
    overflow: "hidden",
    perspective: "400px",
    boxShadow: `
      inset 0 4px 10px hsla(30, 10%, 20%, 0.22),
      inset 0 1px 3px hsla(30, 10%, 20%, 0.1),
      inset 2px 0 6px hsla(30, 10%, 20%, 0.08),
      inset -2px 0 6px hsla(30, 10%, 20%, 0.08),
      0 2px 0 hsla(0, 0%, 100%, 0.3)
    `,
  };

  const halfStyle: React.CSSProperties = {
    width: "100%",
    height: "50%",
    position: "absolute",
    left: 0,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    fontSize: "52px",
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    color: "hsla(30, 10%, 25%, 0.85)",
    lineHeight: "84px",
  };

  return (
    <div style={cardStyle}>
      {/* Static bottom half - shows current value */}
      <div style={{
        ...halfStyle,
        top: "50%",
        background: `linear-gradient(180deg, hsl(30, 5%, 87%) 0%, hsl(30, 5%, 85%) 100%)`,
        boxShadow: "inset 0 1px 2px hsla(30, 10%, 20%, 0.12)",
        borderRadius: "0 0 8px 8px",
      }}>
        <span style={{ position: "absolute", top: "-42px", width: "100%", textAlign: "center" }}>{displayValue}</span>
      </div>

      {/* Static top half - shows current value */}
      <div style={{
        ...halfStyle,
        top: 0,
        background: `linear-gradient(180deg, hsl(30, 5%, 91%) 0%, hsl(30, 5%, 89%) 100%)`,
        borderRadius: "8px 8px 0 0",
      }}>
        <span style={{ position: "absolute", top: "0px", width: "100%", textAlign: "center", lineHeight: "84px" }}>{displayValue}</span>
      </div>

      {/* Flipping top half - old value flips down */}
      {isFlipping && (
        <div style={{
          ...halfStyle,
          top: 0,
          background: `linear-gradient(180deg, hsl(30, 5%, 91%) 0%, hsl(30, 5%, 89%) 100%)`,
          borderRadius: "8px 8px 0 0",
          transformOrigin: "bottom center",
          animation: "flipTop 0.3s ease-in forwards",
          zIndex: 3,
          boxShadow: "0 2px 6px hsla(30, 10%, 20%, 0.2)",
        }}>
          <span style={{ position: "absolute", top: "0px", width: "100%", textAlign: "center", lineHeight: "84px" }}>{prevValue}</span>
        </div>
      )}

      {/* Flipping bottom half - new value flips up */}
      {isFlipping && (
        <div style={{
          ...halfStyle,
          top: "50%",
          background: `linear-gradient(180deg, hsl(30, 5%, 87%) 0%, hsl(30, 5%, 85%) 100%)`,
          borderRadius: "0 0 8px 8px",
          transformOrigin: "top center",
          animation: "flipBottom 0.3s 0.15s ease-out forwards",
          zIndex: 2,
          transform: "rotateX(90deg)",
        }}>
          <span style={{ position: "absolute", top: "-42px", width: "100%", textAlign: "center" }}>{value}</span>
        </div>
      )}

      {/* Center divider line */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: "2px",
        background: "hsla(30, 10%, 20%, 0.15)",
        zIndex: 4,
        transform: "translateY(-1px)",
      }} />

      {/* Scan lines */}
      <div className="absolute inset-0" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, hsla(30, 10%, 20%, 0.015) 3px, hsla(30, 10%, 20%, 0.015) 4px)",
        pointerEvents: "none",
        zIndex: 5,
      }} />

      {/* Outer shadow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        borderRadius: "8px",
        boxShadow: `inset 0 3px 6px hsla(30, 10%, 20%, 0.2), inset 0 -1px 2px hsla(30, 10%, 20%, 0.08), 0 1px 0 hsla(0, 0%, 100%, 0.3)`,
        zIndex: 6,
      }} />
    </div>
  );
};

const DeskClock = () => {
  const [time, setTime] = useState(new Date());
  const [dateOffset, setDateOffset] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const prevSecondRef = useRef<number>(-1);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [photos, setPhotos] = useState<string[]>(() =>
    [...fallbackPhotos].sort(() => Math.random() - 0.5)
  );
  const [photoIndex, setPhotoIndex] = useState(0);
  const [nextPhotoIndex, setNextPhotoIndex] = useState<number | null>(null);
  const [blurPhase, setBlurPhase] = useState<"clear" | "blurring" | "switching" | "clearing">("clear");
  const [lampOn, setLampOn] = useState(true);
  const [lampFlicker, setLampFlicker] = useState<"on" | "off" | "flickering-on" | "flickering-off">("on");
  const [isPulling, setIsPulling] = useState(false);
  const [debugHour, setDebugHour] = useState<number | null>(null);

  useEffect(() => {
    if (!UNSPLASH_ACCESS_KEY) return;
    fetch(`https://api.unsplash.com/photos/random?count=30&query=nature,landscape,travel&orientation=portrait`, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    })
      .then(res => res.json())
      .then((data: Array<{ urls: { small: string }; likes: number }>) => {
        if (Array.isArray(data) && data.length > 0) {
          // Sort by likes (descending) and keep only photos with >= 50 likes
          const quality = data
            .filter(p => p.likes >= 50)
            .sort((a, b) => b.likes - a.likes);
          // Fall back to top 15 by likes if too few pass the threshold
          const selected = quality.length >= 10
            ? quality
            : data.sort((a, b) => b.likes - a.likes).slice(0, 15);
          setPhotos(selected.map(p => p.urls.small));
          setPhotoIndex(0);
        }
      })
      .catch(() => { /* keep fallback photos */ });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (photoIndex + 1) % photos.length;
      // Phase 1: slowly blur out current photo
      setBlurPhase("blurring");
      setTimeout(() => {
        // Phase 2: swap photo while fully blurred
        setPhotoIndex(next);
        setBlurPhase("switching");
        setTimeout(() => {
          // Phase 3: slowly unblur to reveal new photo
          setBlurPhase("clearing");
          setTimeout(() => {
            setBlurPhase("clear");
          }, 1800);
        }, 150);
      }, 1800);
    }, 45000);
    return () => clearInterval(interval);
  }, [photoIndex, photos.length]);

  const playTick = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  }, []);

  const isMutedRef = useRef(isMuted);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  // Debug: press 1=morning, 2=afternoon, 3=evening, 4=night, 0=real time
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, number | null> = {
        "1": 8, "2": 14, "3": 18, "4": 22, "0": null,
      };
      if (e.key in map) setDebugHour(map[e.key]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (debugHour !== null) {
        now.setHours(debugHour, now.getMinutes(), now.getSeconds());
      }
      setTime(now);
      if (now.getSeconds() !== prevSecondRef.current) {
        prevSecondRef.current = now.getSeconds();
        if (!isMutedRef.current) {
          playTick();
        }
      }
    }, 100);
    return () => clearInterval(timer);
  }, [playTick, debugHour]);

  const hour24 = time.getHours();
  const hours = hour24 % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  // Time-of-day lighting system
  const timeProgress = hour24 + minutes / 60; // 0-24 continuous
  const isNight = timeProgress >= 20 || timeProgress < 6;
  const isMorning = timeProgress >= 6 && timeProgress < 12;
  const isAfternoon = timeProgress >= 12 && timeProgress < 17;
  const isEvening = timeProgress >= 17 && timeProgress < 20;

  // Light position: moves from left (morning) to right (afternoon)
  const lightX = isMorning ? 15 + (timeProgress - 6) * 5
    : isAfternoon ? 45 + (timeProgress - 12) * 8
    : isEvening ? 85
    : 50;
  const lightY = isMorning ? 10 : isAfternoon ? 15 : 20;

  // Ambient brightness
  const ambientBrightness = isNight ? 0.25
    : isMorning ? 0.85 + (timeProgress - 6) * 0.025
    : isAfternoon ? 1.0
    : isEvening ? 1.0 - (timeProgress - 17) * 0.25
    : 0.3;

  // Light warmth (color temperature)
  const warmth = isMorning ? { h: 35, s: 60, l: 75, a: 0.15 }
    : isAfternoon ? { h: 40, s: 40, l: 80, a: 0.08 }
    : isEvening ? { h: 38, s: 75, l: 60, a: 0.22 }
    : { h: 220, s: 30, l: 20, a: 0.35 };

  // Page background adapts to time
  const pageBg = isNight
    ? "linear-gradient(180deg, hsl(225, 10%, 32%) 0%, hsl(225, 12%, 26%) 60%, hsl(228, 14%, 20%) 100%)"
    : isMorning
    ? "linear-gradient(180deg, hsl(38, 18%, 92%) 0%, hsl(35, 16%, 86%) 60%, hsl(30, 14%, 76%) 100%)"
    : isAfternoon
    ? "linear-gradient(180deg, hsl(30, 8%, 94%) 0%, hsl(30, 10%, 88%) 60%, hsl(25, 12%, 78%) 100%)"
    : "linear-gradient(180deg, #8EA4B3 0%, #BBD3DA 15%, #E0CCB3 40%, #EFBB8D 70%, #E28F5F 100%)";

  // Clock hand colors
  const handColor = isNight
    ? "linear-gradient(180deg, hsl(120, 60%, 72%) 0%, hsl(120, 50%, 60%) 100%)"
    : "linear-gradient(180deg, hsl(20, 12%, 38%) 0%, hsl(20, 15%, 30%) 100%)";
  const handShadow = isNight
    ? "0 0 8px hsla(120, 60%, 65%, 0.6), 0 0 3px hsla(120, 60%, 65%, 0.3)"
    : "1px 1px 3px hsla(30, 10%, 20%, 0.3)";
  const secondHandColor = isNight ? "hsl(120, 60%, 68%)" : "hsl(0, 65%, 48%)";
  const secondHandShadow = isNight
    ? "0 0 10px hsla(120, 60%, 65%, 0.7), 0 0 4px hsla(120, 60%, 65%, 0.4)"
    : "0 0 4px hsla(0, 65%, 48%, 0.3)";
  const pinColor = isNight
    ? "radial-gradient(circle at 35% 35%, hsl(120, 40%, 75%) 0%, hsl(120, 35%, 60%) 40%, hsl(120, 30%, 45%) 100%)"
    : "radial-gradient(circle at 35% 35%, hsl(30, 8%, 75%) 0%, hsl(30, 8%, 60%) 40%, hsl(20, 12%, 40%) 100%)";
  const pinShadow = isNight
    ? "0 0 8px hsla(120, 50%, 60%, 0.5), inset 0 1px 1px hsla(120, 60%, 80%, 0.3)"
    : "0 1px 3px hsla(30, 10%, 20%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.3)";

  const displayDate = new Date(time);
  displayDate.setDate(displayDate.getDate() + dateOffset);

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
  ];
  const dayNames = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY",
  ];

  const month = monthNames[displayDate.getMonth()];
  const date = displayDate.getDate();
  const dayOfWeek = dayNames[displayDate.getDay()];

  return (
    <div className="flex items-center justify-center min-h-screen" style={{
      background: pageBg,
      transition: "background 2s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Flip animation keyframes + Google Fonts + Tree shadow */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        @keyframes flipTop {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flipBottom {
          0% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(-5%); }
          50% { transform: translateX(5%); }
          100% { transform: translateX(-5%); }
        }
        @keyframes cloudDrift2 {
          0% { transform: translateX(3%); }
          50% { transform: translateX(-4%); }
          100% { transform: translateX(3%); }
        }
        @keyframes pullCord {
          0% { transform: scaleY(1); }
          40% { transform: scaleY(1.25); }
          70% { transform: scaleY(1.05); }
          85% { transform: scaleY(1.12); }
          100% { transform: scaleY(1); }
        }
        @keyframes lampFlickerOn {
          0% { opacity: 0; }
          12% { opacity: 0.4; }
          18% { opacity: 0.1; }
          28% { opacity: 0.6; }
          35% { opacity: 0.2; }
          45% { opacity: 0.75; }
          55% { opacity: 0.4; }
          65% { opacity: 0.9; }
          78% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        @keyframes lampFlickerOff {
          0% { opacity: 1; }
          10% { opacity: 0.6; }
          20% { opacity: 0.85; }
          35% { opacity: 0.3; }
          48% { opacity: 0.55; }
          60% { opacity: 0.15; }
          75% { opacity: 0.3; }
          85% { opacity: 0.05; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* SVG filter for organic leaf sway - feTurbulence + feDisplacementMap */}
      <svg style={{ width: 0, height: 0, position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="leaf-sway" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" numOctaves={3} seed={2}>
              <animate attributeName="baseFrequency" dur="18s" values="0.012;0.018;0.012" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale={45}>
              <animate attributeName="scale" dur="22s" values="35;55;35" repeatCount="indefinite" />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      {/* Ambient light overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: `radial-gradient(ellipse 60% 80% at ${lightX}% ${lightY}%, hsla(${warmth.h}, ${warmth.s}%, ${warmth.l}%, ${warmth.a}) 0%, transparent 70%)`,
        transition: "background 3s ease",
      }} />

      {/* Dappled tree shadow - afternoon & evening */}
      {isAfternoon && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          overflow: "hidden",
        }}>
          {/* Leaf shadow layer - dramatic, large coverage */}
          <div style={{
            position: "absolute", inset: "-40%",
            filter: "url(#leaf-sway) blur(6px)",
            mixBlendMode: "multiply",
            opacity: 0.22,
          }}>
            <svg width="100%" height="100%" viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice">
              <g fill="hsl(30, 15%, 15%)">
                {/* Main branches from top-right */}
                <rect x="850" y="-80" width="5" height="500" rx="3" transform="rotate(-22, 853, 170)" />
                <rect x="950" y="20" width="4" height="400" rx="2" transform="rotate(-42, 952, 220)" />
                <rect x="780" y="-20" width="4" height="360" rx="2" transform="rotate(-10, 782, 160)" />
                <rect x="1050" y="80" width="4" height="320" rx="2" transform="rotate(-58, 1052, 240)" />
                <rect x="700" y="60" width="3" height="280" rx="2" transform="rotate(-5, 702, 200)" />
                {/* Secondary branches */}
                <rect x="900" y="150" width="3" height="220" rx="2" transform="rotate(-70, 902, 260)" />
                <rect x="820" y="200" width="3" height="180" rx="2" transform="rotate(-35, 822, 290)" />

                {/* Dense leaf clusters - top right */}
                <ellipse cx="850" cy="40" rx="45" ry="18" transform="rotate(-20, 850, 40)" />
                <ellipse cx="750" cy="10" rx="38" ry="15" transform="rotate(-35, 750, 10)" />
                <ellipse cx="970" cy="30" rx="42" ry="17" transform="rotate(-10, 970, 30)" />
                <ellipse cx="880" cy="120" rx="36" ry="14" transform="rotate(-28, 880, 120)" />
                <ellipse cx="790" cy="100" rx="40" ry="16" transform="rotate(-50, 790, 100)" />
                <ellipse cx="1020" cy="80" rx="32" ry="13" transform="rotate(-15, 1020, 80)" />
                <ellipse cx="1060" cy="140" rx="38" ry="15" transform="rotate(-38, 1060, 140)" />
                <ellipse cx="920" cy="200" rx="34" ry="14" transform="rotate(-8, 920, 200)" />
                <ellipse cx="1100" cy="100" rx="30" ry="12" transform="rotate(-45, 1100, 100)" />
                <ellipse cx="680" cy="70" rx="28" ry="11" transform="rotate(-55, 680, 70)" />
                <ellipse cx="810" cy="70" rx="35" ry="14" transform="rotate(-42, 810, 70)" />
                <ellipse cx="930" cy="90" rx="30" ry="12" transform="rotate(-25, 930, 90)" />
                <ellipse cx="760" cy="150" rx="32" ry="13" transform="rotate(-60, 760, 150)" />
                <ellipse cx="1000" cy="170" rx="28" ry="11" transform="rotate(-18, 1000, 170)" />

                {/* Mid-screen scattered leaves */}
                <ellipse cx="650" cy="180" rx="30" ry="12" transform="rotate(-55, 650, 180)" />
                <ellipse cx="1150" cy="250" rx="32" ry="13" transform="rotate(-22, 1150, 250)" />
                <ellipse cx="720" cy="260" rx="26" ry="10" transform="rotate(-40, 720, 260)" />
                <ellipse cx="850" cy="310" rx="28" ry="11" transform="rotate(-62, 850, 310)" />
                <ellipse cx="550" cy="120" rx="24" ry="10" transform="rotate(-30, 550, 120)" />
                <ellipse cx="1200" cy="180" rx="30" ry="12" transform="rotate(-48, 1200, 180)" />
                <ellipse cx="480" cy="60" rx="22" ry="9" transform="rotate(-18, 480, 60)" />
                <ellipse cx="1000" cy="300" rx="30" ry="12" transform="rotate(-32, 1000, 300)" />
                <ellipse cx="600" cy="240" rx="25" ry="10" transform="rotate(-45, 600, 240)" />
                <ellipse cx="900" cy="260" rx="27" ry="11" transform="rotate(-15, 900, 260)" />

                {/* Bottom-left branch + leaves */}
                <rect x="100" y="400" width="4" height="300" rx="2" transform="rotate(18, 102, 550)" />
                <rect x="180" y="480" width="3" height="220" rx="2" transform="rotate(35, 182, 590)" />
                <ellipse cx="120" cy="430" rx="34" ry="14" transform="rotate(20, 120, 430)" />
                <ellipse cx="200" cy="480" rx="30" ry="12" transform="rotate(35, 200, 480)" />
                <ellipse cx="80" cy="500" rx="28" ry="11" transform="rotate(10, 80, 500)" />
                <ellipse cx="280" cy="520" rx="26" ry="10" transform="rotate(45, 280, 520)" />
                <ellipse cx="160" cy="560" rx="30" ry="12" transform="rotate(25, 160, 560)" />
                <ellipse cx="50" cy="380" rx="24" ry="10" transform="rotate(8, 50, 380)" />

                {/* Center scattered small leaves */}
                <ellipse cx="450" cy="350" rx="20" ry="8" transform="rotate(-60, 450, 350)" />
                <ellipse cx="600" cy="420" rx="22" ry="9" transform="rotate(-35, 600, 420)" />
                <ellipse cx="350" cy="280" rx="18" ry="7" transform="rotate(-50, 350, 280)" />
                <ellipse cx="520" cy="480" rx="20" ry="8" transform="rotate(-25, 520, 480)" />
                <ellipse cx="750" cy="380" rx="24" ry="10" transform="rotate(-42, 750, 380)" />
                <ellipse cx="300" cy="420" rx="16" ry="7" transform="rotate(-70, 300, 420)" />
                <ellipse cx="420" cy="200" rx="18" ry="7" transform="rotate(-15, 420, 200)" />
                <ellipse cx="580" cy="300" rx="20" ry="8" transform="rotate(-58, 580, 300)" />

                {/* Bottom scattered */}
                <ellipse cx="400" cy="600" rx="24" ry="10" transform="rotate(-20, 400, 600)" />
                <ellipse cx="650" cy="550" rx="20" ry="8" transform="rotate(-40, 650, 550)" />
                <ellipse cx="800" cy="500" rx="22" ry="9" transform="rotate(-30, 800, 500)" />
                <ellipse cx="950" cy="480" rx="20" ry="8" transform="rotate(-55, 950, 480)" />
                <ellipse cx="1100" cy="400" rx="25" ry="10" transform="rotate(-18, 1100, 400)" />
              </g>
            </svg>
          </div>
          {/* Dappled light spots - large bright patches */}
          <div style={{
            position: "absolute", inset: "-40%",
            filter: "url(#leaf-sway) blur(12px)",
            mixBlendMode: "screen",
            opacity: 0.14,
          }}>
            <svg width="100%" height="100%" viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice">
              <g fill="hsl(40, 55%, 88%)">
                <ellipse cx="300" cy="200" rx="140" ry="90" />
                <ellipse cx="550" cy="380" rx="130" ry="80" />
                <ellipse cx="150" cy="420" rx="110" ry="70" />
                <ellipse cx="700" cy="260" rx="120" ry="75" />
                <ellipse cx="420" cy="540" rx="125" ry="78" />
                <ellipse cx="850" cy="400" rx="105" ry="65" />
                <ellipse cx="100" cy="150" rx="95" ry="60" />
                <ellipse cx="600" cy="120" rx="110" ry="68" />
                <ellipse cx="950" cy="300" rx="100" ry="62" />
                <ellipse cx="250" cy="620" rx="115" ry="72" />
                <ellipse cx="750" cy="520" rx="98" ry="60" />
                <ellipse cx="1050" cy="200" rx="108" ry="66" />
                <ellipse cx="480" cy="150" rx="90" ry="55" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* Night mode: Moonlight through window */}
      {isNight && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          overflow: "hidden",
          transition: "opacity 3s ease",
        }}>
          {/* Main moonlight beam - diagonal from upper-left window */}
          <div style={{
            position: "absolute",
            top: "-10%", left: "-8%",
            width: "80%", height: "130%",
            background: `linear-gradient(155deg,
              hsla(210, 50%, 80%, 0.28) 0%,
              hsla(212, 45%, 75%, 0.2) 15%,
              hsla(215, 35%, 70%, 0.1) 40%,
              transparent 65%)`,
            transform: "skewX(-8deg)",
          }} />

          {/* Window frame mullion shadows - vertical bar */}
          <div style={{
            position: "absolute",
            top: "-5%", left: "30%",
            width: "12px", height: "100%",
            background: `linear-gradient(180deg,
              hsla(225, 15%, 10%, 0.45) 0%,
              hsla(225, 15%, 10%, 0.3) 40%,
              hsla(225, 15%, 10%, 0.1) 80%,
              transparent 100%)`,
            transform: "skewX(-8deg) rotate(-2deg)",
            filter: "blur(6px)",
          }} />

          {/* Window frame mullion shadows - second vertical bar (right pane) */}
          <div style={{
            position: "absolute",
            top: "-5%", left: "56%",
            width: "10px", height: "85%",
            background: `linear-gradient(180deg,
              hsla(225, 15%, 10%, 0.3) 0%,
              hsla(225, 15%, 10%, 0.18) 40%,
              hsla(225, 15%, 10%, 0.05) 75%,
              transparent 100%)`,
            transform: "skewX(-8deg) rotate(-2deg)",
            filter: "blur(6px)",
          }} />

          {/* Window frame mullion shadows - horizontal bar */}
          <div style={{
            position: "absolute",
            top: "35%", left: "-5%",
            width: "75%", height: "10px",
            background: `linear-gradient(90deg,
              hsla(225, 15%, 10%, 0.4) 0%,
              hsla(225, 15%, 10%, 0.25) 35%,
              hsla(225, 15%, 10%, 0.08) 70%,
              transparent 100%)`,
            transform: "skewX(-8deg) rotate(-1deg)",
            filter: "blur(6px)",
          }} />

          {/* Window frame - outer edge shadow (top) */}
          <div style={{
            position: "absolute",
            top: "3%", left: "-3%",
            width: "78%", height: "4px",
            background: `linear-gradient(90deg,
              hsla(225, 15%, 10%, 0.2) 0%,
              hsla(225, 15%, 10%, 0.12) 50%,
              transparent 85%)`,
            transform: "skewX(-8deg)",
            filter: "blur(3px)",
          }} />

          {/* Soft moonlight pool on the surface/desk */}
          <div style={{
            position: "absolute",
            bottom: "2%", left: "8%",
            width: "60%", height: "40%",
            background: `radial-gradient(ellipse 100% 70% at 40% 50%,
              hsla(210, 35%, 80%, 0.14) 0%,
              hsla(212, 30%, 75%, 0.07) 40%,
              transparent 75%)`,
            filter: "blur(25px)",
          }} />

          {/* Subtle dust motes in moonlight beam */}
          <div style={{
            position: "absolute",
            top: "10%", left: "5%",
            width: "55%", height: "70%",
            background: `radial-gradient(circle at 25% 20%, hsla(210, 25%, 88%, 0.08) 0%, transparent 35%),
              radial-gradient(circle at 50% 50%, hsla(210, 25%, 88%, 0.05) 0%, transparent 28%),
              radial-gradient(circle at 15% 65%, hsla(210, 25%, 88%, 0.04) 0%, transparent 22%),
              radial-gradient(circle at 40% 35%, hsla(210, 25%, 88%, 0.06) 0%, transparent 30%)`,
            transform: "skewX(-8deg)",
          }} />
        </div>
      )}

      {/* Night mode: Pull cord for lamp */}
      {isNight && (
        <div
          onClick={() => {
            setIsPulling(true);
            setTimeout(() => {
              setIsPulling(false);
              if (lampOn) {
                setLampFlicker("flickering-off");
                setTimeout(() => { setLampOn(false); setLampFlicker("off"); }, 800);
              } else {
                setLampOn(true);
                setLampFlicker("flickering-on");
                setTimeout(() => { setLampFlicker("on"); }, 800);
              }
            }, 400);
          }}
          className="cursor-pointer"
          style={{
            position: "absolute",
            top: "0",
            right: "18%",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transformOrigin: "top center",
            animation: isPulling ? "pullCord 0.5s ease-out" : "none",
          }}
        >
          {/* Continuous string from ceiling */}
          <div style={{
            width: "1.5px",
            height: "130px",
            background: `linear-gradient(180deg, hsla(35, 20%, 55%, 0.4) 0%, hsla(35, 22%, 52%, 0.6) 40%, hsla(35, 25%, 50%, 0.8) 100%)`,
          }} />
          {/* Small bead/handle */}
          <div style={{
            width: "8px",
            height: "14px",
            borderRadius: "3px",
            background: `linear-gradient(180deg, hsl(35, 15%, 72%) 0%, hsl(33, 18%, 60%) 50%, hsl(30, 20%, 52%) 100%)`,
            boxShadow: `0 2px 4px hsla(30, 10%, 20%, 0.3), inset 0 1px 0 hsla(0, 0%, 100%, 0.25)`,
          }} />
          {/* Tiny knot at bottom */}
          <div style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            marginTop: "1px",
            background: `radial-gradient(circle, hsl(33, 20%, 65%) 0%, hsl(30, 22%, 52%) 100%)`,
            boxShadow: `0 1px 2px hsla(30, 10%, 20%, 0.25)`,
          }} />
        </div>
      )}

      {/* Night mode: Warm desk lamp from top of screen */}
      {isNight && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5,
          overflow: "hidden",
          opacity: lampFlicker === "on" ? 1 : lampFlicker === "off" ? 0 : undefined,
          animation: lampFlicker === "flickering-on" ? "lampFlickerOn 0.8s ease-out forwards"
            : lampFlicker === "flickering-off" ? "lampFlickerOff 0.8s ease-out forwards"
            : "none",
        }}>
          {/* Soft lamp cone - wider, extends past clock top */}
          <div style={{
            position: "absolute",
            top: "0", left: "0", right: "0", bottom: "0",
            clipPath: "polygon(40% 0%, 60% 0%, 92% 70%, 8% 70%)",
            background: `linear-gradient(180deg,
              hsla(42, 85%, 72%, 0.75) 0%,
              hsla(43, 75%, 70%, 0.4) 15%,
              hsla(44, 60%, 68%, 0.15) 35%,
              hsla(45, 50%, 65%, 0.04) 52%,
              transparent 66%)`,
            filter: "blur(45px)",
          }} />
          {/* Inner bright core */}
          <div style={{
            position: "absolute",
            top: "0", left: "0", right: "0", bottom: "0",
            clipPath: "polygon(44% 0%, 56% 0%, 80% 65%, 20% 65%)",
            background: `linear-gradient(180deg,
              hsla(40, 90%, 78%, 0.6) 0%,
              hsla(42, 75%, 74%, 0.25) 18%,
              hsla(44, 55%, 70%, 0.06) 38%,
              transparent 56%)`,
            filter: "blur(35px)",
          }} />
        </div>
      )}

      <div className="relative" style={{ perspective: "900px", zIndex: 10 }}>
        {/* Night mode: warm backlight glow moved to page-level */}

        {/* Shadow on surface - soft and diffused */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{
          bottom: "-12px",
          width: "92%", height: "60px",
          background: "radial-gradient(ellipse 100% 80%, hsla(30, 10%, 20%, 0.28) 0%, transparent 70%)",
          filter: "blur(18px)",
          transform: "rotateX(4deg) rotateY(-1deg)",
        }} />

        {/* 3D clock wrapper - preserves child transforms in 3D space */}
        <div style={{
          transform: "rotateX(4deg) rotateY(-1deg)",
          transformStyle: "preserve-3d",
          position: "relative",
        }}>
          {/* Bottom face - connected via 3D transform */}
          <div style={{
            position: "absolute",
            left: 0, right: 0, bottom: 0,
            height: "12px",
            borderRadius: "0 0 16px 16px",
            background: `linear-gradient(180deg, hsl(30, 5%, 74%) 0%, hsl(30, 5%, 70%) 50%, hsl(30, 6%, 66%) 100%)`,
            transformOrigin: "top center",
            transform: "rotateX(-90deg)",
            boxShadow: "0 4px 12px hsla(30, 10%, 20%, 0.15)",
          }} />

          {/* Right face - connected via 3D transform */}
          <div style={{
            position: "absolute",
            top: "16px", bottom: "16px", right: 0,
            width: "10px",
            borderRadius: "0 16px 16px 0",
            background: `linear-gradient(90deg, hsl(30, 5%, 76%) 0%, hsl(30, 5%, 72%) 50%, hsl(30, 6%, 68%) 100%)`,
            transformOrigin: "left center",
            transform: "rotateY(90deg)",
          }} />

        {/* Main clock body */}
        <div className="relative flex items-start gap-0" style={{
          background: `
            linear-gradient(165deg, hsl(30, 5%, 90%) 0%, hsl(30, 5%, 86%) 20%, hsl(30, 4%, 82%) 50%, hsl(30, 5%, 84%) 80%, hsl(30, 6%, 87%) 100%)
          `,
          backgroundImage: `
            linear-gradient(165deg, hsl(30, 5%, 90%) 0%, hsl(30, 5%, 86%) 20%, hsl(30, 4%, 82%) 50%, hsl(30, 5%, 84%) 80%, hsl(30, 6%, 87%) 100%),
            url("data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='%23000' opacity='0.015'/%3E%3Crect x='1' y='1' width='2' height='2' fill='%23fff' opacity='0.015'/%3E%3C/svg%3E")
          `,
          borderRadius: "16px",
          paddingTop: "22px",
          paddingBottom: "42px",
          paddingLeft: "18px",
          paddingRight: "18px",
          width: "540px",
          boxShadow: `
            0 20px 60px hsla(30, 10%, 20%, 0.2),
            0 8px 24px hsla(30, 10%, 20%, 0.12),
            0 2px 6px hsla(30, 10%, 20%, 0.08),
            inset 0 1px 0 hsla(0, 0%, 100%, 0.55),
            inset 0 -1px 0 hsla(30, 10%, 50%, 0.12),
            inset 1px 0 0 hsla(0, 0%, 100%, 0.2),
            inset -1px 0 0 hsla(30, 10%, 50%, 0.08)
          `,
        }}>
          {/* Edge highlights */}
          <div className="absolute top-0 left-3 right-3 h-[2px] rounded-full" style={{
            background: "linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.6), transparent)",
          }} />
          <div className="absolute bottom-0 left-3 right-3 h-[1px] rounded-full" style={{
            background: "linear-gradient(90deg, transparent, hsla(30, 10%, 50%, 0.2), transparent)",
          }} />

          {/* Left: Photo Frame */}
          <div className="flex items-center justify-center" style={{ width: "145px", flexShrink: 0 }}>
            <div style={{
              width: "122px", height: "174px", borderRadius: "10px", overflow: "hidden", position: "relative",
              boxShadow: `
                inset 0 5px 14px hsla(30, 10%, 20%, 0.35),
                inset 0 1px 3px hsla(30, 10%, 20%, 0.15),
                inset 0 -2px 6px hsla(30, 10%, 25%, 0.12),
                inset 3px 0 8px hsla(30, 10%, 20%, 0.12),
                inset -3px 0 8px hsla(30, 10%, 20%, 0.12),
                0 2px 0 hsla(0, 0%, 100%, 0.35),
                0 -1px 0 hsla(30, 10%, 40%, 0.08)
              `,
              background: "hsl(30, 5%, 70%)",
            }}>
              {/* Inner bevel rim */}
              <div className="absolute inset-0" style={{
                borderRadius: "10px",
                boxShadow: `
                  inset 0 0 0 2px hsla(30, 10%, 15%, 0.12),
                  inset 0 0 0 4px hsla(30, 10%, 20%, 0.05)
                `,
                zIndex: 2, pointerEvents: "none",
              }} />
              <img src={photos[photoIndex]} alt="Photo" className="w-full h-full object-cover"
                style={{
                  filter: `saturate(0.85) contrast(1.05) blur(${
                    blurPhase === "blurring" || blurPhase === "switching" ? "16px" : "0px"
                  })`,
                  opacity: blurPhase === "blurring" || blurPhase === "switching" ? 0.5 : 1,
                  position: "absolute", top: 0, left: 0,
                  transition: blurPhase === "clear" ? "none" : "filter 1.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }} />
            </div>
          </div>

          {/* Center: Analog Clock - clickable for mute toggle */}
          <div className="flex items-center justify-center" style={{ width: "185px", flexShrink: 0 }}>
            <div
              onClick={() => setIsMuted(m => !m)}
              style={{
                width: "164px", height: "174px", borderRadius: "10px",
                background: `linear-gradient(155deg, hsl(40, 18%, 97%) 0%, hsl(38, 14%, 95%) 30%, hsl(35, 10%, 91%) 60%, hsl(33, 8%, 89%) 100%)`,
                boxShadow: `
                  inset 0 5px 14px hsla(30, 10%, 20%, 0.25),
                  inset 0 1px 3px hsla(30, 10%, 20%, 0.12),
                  inset 0 -2px 6px hsla(30, 10%, 25%, 0.08),
                  inset 3px 0 8px hsla(30, 10%, 20%, 0.08),
                  inset -3px 0 8px hsla(30, 10%, 20%, 0.08),
                  0 2px 0 hsla(0, 0%, 100%, 0.4),
                  0 -1px 0 hsla(30, 10%, 40%, 0.06)
                `,
                position: "relative",
              }}
              className="cursor-pointer"
            >
              {/* Mute indicator */}
              {isMuted && (
                <div className="absolute" style={{
                  top: "8px", right: "8px",
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "hsl(0, 50%, 55%)",
                  boxShadow: "0 0 4px hsla(0, 50%, 55%, 0.4)",
                  zIndex: 10,
                }} />
              )}

              {/* Decorative inner borders */}
              <div className="absolute" style={{
                top: "14px", left: "14px", right: "14px", bottom: "14px",
                border: "1px solid hsla(30, 10%, 40%, 0.12)", borderRadius: "2px",
              }} />
              <div className="absolute" style={{
                top: "19px", left: "19px", right: "19px", bottom: "19px",
                border: "1px solid hsla(30, 10%, 40%, 0.07)", borderRadius: "2px",
              }} />

              {/* Inner decorative rectangle - CENTERED */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{
                width: "40px", height: "55px",
                border: "1.5px solid hsla(30, 10%, 40%, 0.13)", borderRadius: "2px",
              }} />

              {/* Hour numbers - more dramatic retro font */}
              {[
                { num: "XII", top: "20px", left: "50%", transform: "translateX(-50%)" },
                { num: "III", top: "50%", right: "18px", transform: "translateY(-50%)" },
                { num: "VI", bottom: "20px", left: "50%", transform: "translateX(-50%)" },
                { num: "IX", top: "50%", left: "18px", transform: "translateY(-50%)" },
              ].map((pos) => (
                <div key={pos.num} className="absolute" style={{
                  ...pos,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "13px", fontWeight: 900,
                  color: "hsla(30, 10%, 25%, 0.7)",
                  lineHeight: 1,
                  letterSpacing: "1px",
                }}>{pos.num}</div>
              ))}

              {/* Tick marks */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                const isMain = i % 3 === 0;
                return (
                  <div key={i} className="absolute" style={{
                    top: "50%", left: "50%",
                    width: isMain ? "0" : "1px", height: isMain ? "0" : "6px",
                    background: isMain ? "transparent" : "hsla(30, 10%, 30%, 0.25)",
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-60px)`,
                    transformOrigin: "center center",
                  }} />
                );
              })}

              {/* Hour hand */}
              <div className="absolute" style={{
                top: "50%", left: "50%",
                width: "3.5px", height: "42px",
                background: handColor,
                borderRadius: "2px", transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
                transition: "transform 0.5s ease, background 2s ease, box-shadow 2s ease",
                boxShadow: handShadow,
              }} />

              {/* Minute hand */}
              <div className="absolute" style={{
                top: "50%", left: "50%",
                width: "2.5px", height: "55px",
                background: handColor,
                borderRadius: "2px", transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
                transition: "transform 0.3s ease, background 2s ease, box-shadow 2s ease",
                boxShadow: handShadow,
              }} />

              {/* Second hand */}
              <div className="absolute" style={{
                top: "50%", left: "50%",
                width: "1px", height: "58px",
                background: secondHandColor,
                transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
                boxShadow: secondHandShadow,
                transition: "background 2s ease, box-shadow 2s ease",
              }} />

              {/* Center pin */}
              <div className="absolute" style={{
                top: "50%", left: "50%",
                width: "10px", height: "10px", borderRadius: "50%",
                background: pinColor,
                transform: "translate(-50%, -50%)",
                boxShadow: pinShadow,
                transition: "background 2s ease, box-shadow 2s ease",
              }} />
            </div>
          </div>

          {/* Right: Calendar */}
          <div className="flex flex-col items-center justify-center flex-1 relative" style={{ alignSelf: "center" }}>
            {/* Month label */}
            <div style={{
              background: "linear-gradient(180deg, hsl(30, 5%, 74%) 0%, hsl(30, 5%, 78%) 100%)",
              borderRadius: "4px", padding: "3px 14px",
              fontSize: "9px", fontWeight: 500, letterSpacing: "1.5px",
              color: "hsla(30, 10%, 28%, 0.75)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `
                inset 0 2px 4px hsla(30, 10%, 20%, 0.18),
                inset 0 -1px 2px hsla(30, 10%, 25%, 0.06),
                0 1px 0 hsla(0, 0%, 100%, 0.3)
              `,
              marginBottom: "8px",
            }}>{month}</div>

            {/* Flip Date */}
            <FlipDate value={date.toString().padStart(2, "0")} audioCtxRef={audioCtxRef} isMuted={isMuted} />

            {/* Day of week */}
            <div style={{
              background: "linear-gradient(180deg, hsl(30, 5%, 74%) 0%, hsl(30, 5%, 78%) 100%)",
              borderRadius: "4px", padding: "3px 12px",
              fontSize: "8px", fontWeight: 500, letterSpacing: "1.2px",
              color: "hsla(30, 10%, 28%, 0.75)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `
                inset 0 2px 4px hsla(30, 10%, 20%, 0.18),
                inset 0 -1px 2px hsla(30, 10%, 25%, 0.06),
                0 1px 0 hsla(0, 0%, 100%, 0.3)
              `,
              marginTop: "8px",
            }}>{dayOfWeek}</div>
          </div>

          {/* 3 Knobs on the absolute right edge */}
          {[
            { top: "30%", action: () => setDateOffset(d => d - 1), title: "Previous day" },
            { top: "50%", action: () => setDateOffset(0), title: "Reset to today" },
            { top: "70%", action: () => setDateOffset(d => d + 1), title: "Next day" },
          ].map((knob, idx) => (
            <button
              key={idx}
              onClick={knob.action}
              className="absolute"
              style={{
                right: "-22px",
                top: knob.top,
                transform: "translateY(-50%)",
                width: "22px",
                height: "36px",
                background: `linear-gradient(90deg, hsl(30, 5%, 74%) 0%, hsl(30, 5%, 84%) 25%, hsl(30, 5%, 80%) 50%, hsl(30, 5%, 84%) 75%, hsl(30, 5%, 76%) 100%)`,
                borderRadius: "0 8px 8px 0",
                border: "none",
                boxShadow: `
                  4px 3px 8px hsla(30, 10%, 20%, 0.3),
                  inset -2px 0 3px hsla(0, 0%, 100%, 0.3),
                  inset 0 2px 0 hsla(0, 0%, 100%, 0.25),
                  inset 0 -2px 0 hsla(30, 10%, 30%, 0.2)
                `,
                backgroundImage: `
                  linear-gradient(90deg, hsl(30, 5%, 74%) 0%, hsl(30, 5%, 84%) 25%, hsl(30, 5%, 80%) 50%, hsl(30, 5%, 84%) 75%, hsl(30, 5%, 76%) 100%),
                  repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(30, 10%, 20%, 0.12) 2px, hsla(30, 10%, 20%, 0.12) 3px)
                `,
                padding: 0,
                transition: "transform 0.1s ease",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scaleX(0.75)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scaleX(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scaleX(1)";
              }}
              title={knob.title}
            />
          ))}

          {/* Ambient light reflection on clock body */}
          <div className="absolute inset-0 rounded-[16px] pointer-events-none" style={{
            background: `radial-gradient(ellipse 50% 60% at ${lightX}% ${lightY}%, hsla(${warmth.h}, ${warmth.s}%, ${warmth.l}%, ${warmth.a * 0.6}) 0%, transparent 70%)`,
            transition: "background 3s ease",
            zIndex: 20,
          }} />

          {/* Night overlay on clock body - subtle dim */}
          {isNight && (
            <div className="absolute inset-0 rounded-[16px] pointer-events-none" style={{
              background: "hsla(220, 15%, 15%, 0.15)",
              transition: "opacity 3s ease",
              zIndex: 19,
            }} />
          )}

          {/* Night mode: warm lamp reflection on clock surface */}
          {isNight && (
            <div className="absolute inset-0 rounded-[16px] pointer-events-none" style={{
              opacity: lampFlicker === "on" ? 1 : lampFlicker === "off" ? 0 : undefined,
              animation: lampFlicker === "flickering-on" ? "lampFlickerOn 0.8s ease-out forwards"
                : lampFlicker === "flickering-off" ? "lampFlickerOff 0.8s ease-out forwards"
                : "none",
              zIndex: 21,
            }}>
              {/* Top-down warm light reflection on clock body */}
              <div className="absolute inset-0 rounded-[16px]" style={{
                background: `linear-gradient(180deg,
                  hsla(45, 45%, 80%, 0.12) 0%,
                  hsla(45, 40%, 75%, 0.06) 25%,
                  transparent 50%)`,
              }} />
              {/* Subtle specular highlight near top */}
              <div className="absolute" style={{
                top: "6px", left: "15%", right: "15%",
                height: "18px",
                borderRadius: "8px",
                background: `linear-gradient(90deg,
                  transparent 0%,
                  hsla(45, 40%, 88%, 0.15) 30%,
                  hsla(45, 45%, 90%, 0.2) 50%,
                  hsla(45, 40%, 88%, 0.15) 70%,
                  transparent 100%)`,
                filter: "blur(4px)",
              }} />
            </div>
          )}

          {/* Evening warm tint on clock */}
          {isEvening && (
            <div className="absolute inset-0 rounded-[16px] pointer-events-none" style={{
              background: `radial-gradient(ellipse 80% 80% at 80% 30%, hsla(38, 70%, 55%, 0.08) 0%, transparent 70%)`,
              zIndex: 20,
            }} />
          )}
        </div>
        {/* Close 3D wrapper */}
        </div>
      </div>

      {/* Credit */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "20px",
        fontSize: "11px",
        fontFamily: "'DM Sans', sans-serif",
        color: isNight ? "hsla(0, 0%, 70%, 0.4)" : "hsla(30, 10%, 30%, 0.35)",
        letterSpacing: "0.5px",
        zIndex: 10,
        transition: "color 2s ease",
      }}>
        Design by{" "}
        <a
          href="https://ruocanpeng.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "inherit",
            textDecoration: "none",
            borderBottom: "1px solid currentColor",
            paddingBottom: "1px",
          }}
        >
          Stella P.
        </a>
      </div>
    </div>
  );
};

export default DeskClock;
