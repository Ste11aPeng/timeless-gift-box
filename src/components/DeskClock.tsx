import { useState, useEffect, useRef, useMemo } from "react";
import photo1 from "@/assets/photo-1.png";
import photo2 from "@/assets/photo-2.png";
import photo3 from "@/assets/photo-3.png";
import photo4 from "@/assets/photo-4.png";
import photo5 from "@/assets/photo-5.png";
import photo6 from "@/assets/photo-6.png";
import photo7 from "@/assets/photo-7.png";
import couplePhoto from "@/assets/couple-photo.png";

const allPhotos = [couplePhoto, photo1, photo2, photo3, photo4, photo5, photo6, photo7];

const FlipDate = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setPrevValue(displayValue);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

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
    color: "hsla(30, 10%, 25%, 0.8)",
    position: "relative",
    overflow: "hidden",
    perspective: "400px",
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
  };

  return (
    <div style={cardStyle}>
      {/* Static bottom half - shows new value */}
      <div style={{
        ...halfStyle,
        top: "50%",
        background: `linear-gradient(180deg, hsl(30, 5%, 87%) 0%, hsl(30, 5%, 85%) 100%)`,
        boxShadow: "inset 0 1px 2px hsla(30, 10%, 20%, 0.12)",
        borderRadius: "0 0 8px 8px",
      }}>
        <span style={{ transform: "translateY(-50%)" }}>{displayValue}</span>
      </div>

      {/* Static top half - shows new value */}
      <div style={{
        ...halfStyle,
        top: 0,
        background: `linear-gradient(180deg, hsl(30, 5%, 91%) 0%, hsl(30, 5%, 89%) 100%)`,
        borderRadius: "8px 8px 0 0",
      }}>
        <span style={{ transform: "translateY(50%)" }}>{displayValue}</span>
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
          <span style={{ transform: "translateY(50%)" }}>{prevValue}</span>
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
          <span style={{ transform: "translateY(-50%)" }}>{value}</span>
        </div>
      )}

      {/* Center divider line */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: "2px",
        background: "hsla(30, 10%, 20%, 0.12)",
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

  const randomPhoto = useMemo(() => {
    const shuffled = [...allPhotos].sort(() => Math.random() - 0.5);
    return shuffled[0];
  }, []);

  const playTick = () => {
    if (isMuted) return;
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
  };

  const isMutedRef = useRef(isMuted);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      if (now.getSeconds() !== prevSecondRef.current) {
        prevSecondRef.current = now.getSeconds();
        if (!isMutedRef.current) {
          playTick();
        }
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

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
    <div className="flex items-center justify-center min-h-screen" style={{ background: "linear-gradient(180deg, hsl(30, 8%, 92%) 0%, hsl(30, 10%, 88%) 100%)" }}>
      {/* Flip animation keyframes */}
      <style>{`
        @keyframes flipTop {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flipBottom {
          0% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>

      <div className="relative" style={{ perspective: "1200px" }}>
        {/* Shadow on surface */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2" style={{
          width: "96%", height: "40px",
          background: "radial-gradient(ellipse, hsla(30, 10%, 20%, 0.35) 0%, transparent 70%)",
          filter: "blur(12px)",
        }} />

        {/* Main clock body */}
        <div className="relative flex items-stretch gap-0" style={{
          background: `linear-gradient(165deg, hsl(30, 5%, 90%) 0%, hsl(30, 5%, 86%) 20%, hsl(30, 4%, 82%) 50%, hsl(30, 5%, 84%) 80%, hsl(30, 6%, 87%) 100%)`,
          borderRadius: "14px",
          padding: "18px",
          width: "540px",
          height: "230px",
          boxShadow: `
            0 12px 40px hsla(30, 10%, 20%, 0.3),
            0 4px 12px hsla(30, 10%, 20%, 0.15),
            0 1px 3px hsla(30, 10%, 20%, 0.1),
            inset 0 1px 0 hsla(0, 0%, 100%, 0.5),
            inset 0 -1px 0 hsla(30, 10%, 50%, 0.15),
            inset 1px 0 0 hsla(0, 0%, 100%, 0.2),
            inset -1px 0 0 hsla(30, 10%, 50%, 0.1)
          `,
          transform: "rotateX(2deg) rotateY(-1deg)",
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
              width: "122px", height: "174px", borderRadius: "8px", overflow: "hidden", position: "relative",
              boxShadow: `
                inset 0 3px 8px hsla(30, 10%, 20%, 0.35),
                inset 0 -1px 3px hsla(30, 10%, 20%, 0.15),
                inset 2px 0 4px hsla(30, 10%, 20%, 0.1),
                inset -2px 0 4px hsla(30, 10%, 20%, 0.1),
                0 1px 0 hsla(0, 0%, 100%, 0.3)
              `,
              background: "hsl(30, 5%, 72%)",
            }}>
              <div className="absolute inset-0" style={{
                borderRadius: "8px",
                boxShadow: "inset 0 0 0 3px hsla(30, 10%, 20%, 0.08)",
                zIndex: 2, pointerEvents: "none",
              }} />
              <img src={randomPhoto} alt="Photo" className="w-full h-full object-cover"
                style={{ filter: "saturate(0.85) contrast(1.05)" }} />
            </div>
          </div>

          {/* Center: Analog Clock - clickable for mute toggle */}
          <div className="flex items-center justify-center" style={{ width: "185px", flexShrink: 0 }}>
            <div
              onClick={() => setIsMuted(m => !m)}
              style={{
                width: "164px", height: "174px", borderRadius: "8px",
                background: `linear-gradient(145deg, hsl(40, 18%, 97%) 0%, hsl(38, 14%, 95%) 40%, hsl(35, 12%, 92%) 100%)`,
                boxShadow: `
                  inset 0 3px 8px hsla(30, 10%, 20%, 0.25),
                  inset 0 -1px 3px hsla(30, 10%, 20%, 0.1),
                  inset 2px 0 4px hsla(30, 10%, 20%, 0.08),
                  inset -2px 0 4px hsla(30, 10%, 20%, 0.08),
                  0 1px 0 hsla(0, 0%, 100%, 0.35)
                `,
                position: "relative",
                cursor: "pointer",
              }}
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

              {/* Hour numbers */}
              {[
                { num: "12", top: "22px", left: "50%", transform: "translateX(-50%)" },
                { num: "3", top: "50%", right: "22px", transform: "translateY(-50%)" },
                { num: "6", bottom: "22px", left: "50%", transform: "translateX(-50%)" },
                { num: "9", top: "50%", left: "22px", transform: "translateY(-50%)" },
              ].map((pos) => (
                <div key={pos.num} className="absolute" style={{
                  ...pos,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "14px", fontWeight: 400,
                  color: "hsla(30, 10%, 30%, 0.65)", lineHeight: 1,
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
                background: "linear-gradient(180deg, hsl(20, 12%, 38%) 0%, hsl(20, 15%, 30%) 100%)",
                borderRadius: "2px", transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
                transition: "transform 0.5s ease",
                boxShadow: "1px 1px 3px hsla(30, 10%, 20%, 0.3)",
              }} />

              {/* Minute hand */}
              <div className="absolute" style={{
                top: "50%", left: "50%",
                width: "2.5px", height: "55px",
                background: "linear-gradient(180deg, hsl(20, 12%, 38%) 0%, hsl(20, 15%, 30%) 100%)",
                borderRadius: "2px", transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
                transition: "transform 0.3s ease",
                boxShadow: "1px 1px 2px hsla(30, 10%, 20%, 0.25)",
              }} />

              {/* Second hand */}
              <div className="absolute" style={{
                top: "50%", left: "50%",
                width: "1px", height: "58px",
                background: "hsl(0, 65%, 48%)",
                transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
                boxShadow: "0 0 4px hsla(0, 65%, 48%, 0.3)",
              }} />

              {/* Center pin */}
              <div className="absolute" style={{
                top: "50%", left: "50%",
                width: "10px", height: "10px", borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, hsl(30, 8%, 75%) 0%, hsl(30, 8%, 60%) 40%, hsl(20, 12%, 40%) 100%)`,
                transform: "translate(-50%, -50%)",
                boxShadow: `0 1px 3px hsla(30, 10%, 20%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.3)`,
              }} />
            </div>
          </div>

          {/* Right: Calendar */}
          <div className="flex flex-col items-center justify-center flex-1 relative">
            {/* Month label */}
            <div style={{
              background: "linear-gradient(180deg, hsl(30, 5%, 76%) 0%, hsl(30, 5%, 79%) 100%)",
              borderRadius: "4px", padding: "3px 14px",
              fontSize: "9px", fontWeight: 500, letterSpacing: "1.5px",
              color: "hsla(30, 10%, 30%, 0.7)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `inset 0 1px 3px hsla(30, 10%, 20%, 0.2), 0 1px 0 hsla(0, 0%, 100%, 0.3)`,
              marginBottom: "8px",
            }}>{month}</div>

            {/* Flip Date */}
            <FlipDate value={date.toString().padStart(2, "0")} />

            {/* Day of week */}
            <div style={{
              background: "linear-gradient(180deg, hsl(30, 5%, 76%) 0%, hsl(30, 5%, 79%) 100%)",
              borderRadius: "4px", padding: "3px 12px",
              fontSize: "8px", fontWeight: 500, letterSpacing: "1.2px",
              color: "hsla(30, 10%, 30%, 0.7)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `inset 0 1px 3px hsla(30, 10%, 20%, 0.2), 0 1px 0 hsla(0, 0%, 100%, 0.3)`,
              marginTop: "8px",
            }}>{dayOfWeek}</div>
          </div>

          {/* 3 Knobs on the absolute right edge of the body */}
          {[
            { top: "32%", action: () => setDateOffset(d => d - 1), title: "Previous day" },
            { top: "50%", action: () => setDateOffset(0), title: "Reset to today" },
            { top: "68%", action: () => setDateOffset(d => d + 1), title: "Next day" },
          ].map((knob, idx) => (
            <button
              key={idx}
              onClick={knob.action}
              className="absolute"
              style={{
                right: "-16px",
                top: knob.top,
                transform: "translateY(-50%)",
                width: "16px",
                height: "28px",
                background: `linear-gradient(90deg, hsl(30, 5%, 76%) 0%, hsl(30, 5%, 84%) 30%, hsl(30, 5%, 80%) 50%, hsl(30, 5%, 84%) 70%, hsl(30, 5%, 76%) 100%)`,
                borderRadius: "0 6px 6px 0",
                border: "none",
                cursor: "pointer",
                boxShadow: `
                  3px 2px 6px hsla(30, 10%, 20%, 0.25),
                  inset -1px 0 2px hsla(0, 0%, 100%, 0.25),
                  inset 0 1px 0 hsla(0, 0%, 100%, 0.2),
                  inset 0 -1px 0 hsla(30, 10%, 30%, 0.15)
                `,
                backgroundImage: `
                  linear-gradient(90deg, hsl(30, 5%, 76%) 0%, hsl(30, 5%, 84%) 30%, hsl(30, 5%, 80%) 50%, hsl(30, 5%, 84%) 70%, hsl(30, 5%, 76%) 100%),
                  repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(30, 10%, 20%, 0.1) 2px, hsla(30, 10%, 20%, 0.1) 3px)
                `,
                padding: 0,
                transition: "transform 0.1s ease",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scaleX(0.8)";
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
        </div>
      </div>
    </div>
  );
};

export default DeskClock;
