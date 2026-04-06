import { useState, useEffect } from "react";
import couplePhoto from "@/assets/couple-photo.png";

const DeskClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
  ];
  const dayNames = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY",
  ];

  const month = monthNames[time.getMonth()];
  const date = time.getDate();
  const dayOfWeek = dayNames[time.getDay()];

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "hsl(var(--wall-bg))" }}>
      {/* Scene with perspective */}
      <div className="relative" style={{ perspective: "1200px" }}>
        {/* Shadow on surface */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2"
          style={{
            width: "92%",
            height: "30px",
            background: "radial-gradient(ellipse, hsla(var(--clock-shadow), 0.35) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />

        {/* Main clock body */}
        <div
          className="relative flex items-stretch gap-0"
          style={{
            background: `linear-gradient(
              160deg,
              hsl(30, 6%, 88%) 0%,
              hsl(30, 5%, 82%) 30%,
              hsl(30, 4%, 78%) 60%,
              hsl(30, 5%, 80%) 100%
            )`,
            borderRadius: "12px",
            padding: "16px",
            width: "520px",
            height: "220px",
            boxShadow: `
              0 8px 32px hsla(var(--clock-shadow), 0.25),
              0 2px 8px hsla(var(--clock-shadow), 0.15),
              inset 0 1px 0 hsla(0, 0%, 100%, 0.3),
              inset 0 -1px 2px hsla(var(--clock-shadow), 0.1)
            `,
            transform: "rotateX(2deg) rotateY(-1deg)",
          }}
        >
          {/* Left: Photo Frame */}
          <div className="flex items-center justify-center" style={{ width: "140px", flexShrink: 0 }}>
            <div
              style={{
                width: "120px",
                height: "170px",
                borderRadius: "6px",
                overflow: "hidden",
                boxShadow: `
                  inset 0 2px 6px hsla(var(--clock-shadow), 0.3),
                  inset 0 0 0 2px hsla(var(--clock-shadow), 0.08)
                `,
                background: "hsl(30, 5%, 75%)",
              }}
            >
              <img
                src={couplePhoto}
                alt="Photo"
                className="w-full h-full object-cover"
                style={{ filter: "saturate(0.85) contrast(1.05)" }}
              />
            </div>
          </div>

          {/* Center: Analog Clock */}
          <div className="flex items-center justify-center" style={{ width: "180px", flexShrink: 0 }}>
            <div
              style={{
                width: "160px",
                height: "170px",
                borderRadius: "6px",
                background: `linear-gradient(
                  135deg,
                  hsl(40, 20%, 97%) 0%,
                  hsl(35, 15%, 93%) 100%
                )`,
                boxShadow: `
                  inset 0 2px 6px hsla(var(--clock-shadow), 0.2),
                  inset 0 0 0 2px hsla(var(--clock-shadow), 0.06)
                `,
                position: "relative",
              }}
            >
              {/* Decorative inner border */}
              <div
                className="absolute"
                style={{
                  top: "15px",
                  left: "15px",
                  right: "15px",
                  bottom: "15px",
                  border: "1px solid hsla(var(--clock-shadow), 0.12)",
                  borderRadius: "2px",
                }}
              />
              <div
                className="absolute"
                style={{
                  top: "20px",
                  left: "20px",
                  right: "20px",
                  bottom: "20px",
                  border: "1px solid hsla(var(--clock-shadow), 0.08)",
                  borderRadius: "2px",
                }}
              />

              {/* Inner decorative rectangle */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: "40px",
                  width: "40px",
                  height: "55px",
                  border: "1.5px solid hsla(var(--clock-shadow), 0.15)",
                  borderRadius: "2px",
                }}
              />

              {/* Hour numbers */}
              {[
                { num: "12", top: "22px", left: "50%", transform: "translateX(-50%)" },
                { num: "3", top: "50%", right: "22px", transform: "translateY(-50%)" },
                { num: "6", bottom: "22px", left: "50%", transform: "translateX(-50%)" },
                { num: "9", top: "50%", left: "22px", transform: "translateY(-50%)" },
              ].map((pos) => (
                <div
                  key={pos.num}
                  className="absolute"
                  style={{
                    ...pos,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "hsla(var(--clock-shadow), 0.7)",
                    lineHeight: 1,
                  }}
                >
                  {pos.num}
                </div>
              ))}

              {/* Tick marks */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                const isMain = i % 3 === 0;
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      width: isMain ? "0" : "1px",
                      height: isMain ? "0" : "6px",
                      background: isMain ? "transparent" : "hsla(var(--clock-shadow), 0.3)",
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-60px)`,
                      transformOrigin: "center center",
                    }}
                  />
                );
              })}

              {/* Hour hand */}
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "3px",
                  height: "42px",
                  background: "hsl(var(--clock-hand))",
                  borderRadius: "2px",
                  transformOrigin: "bottom center",
                  transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
                  transition: "transform 0.5s ease",
                }}
              />

              {/* Minute hand */}
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "2px",
                  height: "55px",
                  background: "hsl(var(--clock-hand))",
                  borderRadius: "2px",
                  transformOrigin: "bottom center",
                  transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
                  transition: "transform 0.3s ease",
                }}
              />

              {/* Second hand */}
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "1px",
                  height: "58px",
                  background: "hsl(0, 50%, 45%)",
                  transformOrigin: "bottom center",
                  transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
                }}
              />

              {/* Center pin */}
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, hsl(30, 10%, 55%) 0%, hsl(var(--clock-hand)) 80%)`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 1px 3px hsla(var(--clock-shadow), 0.3)",
                }}
              />
            </div>
          </div>

          {/* Right: Calendar */}
          <div className="flex flex-col items-center justify-center flex-1 relative">
            {/* Month label */}
            <div
              style={{
                background: "hsl(30, 5%, 78%)",
                borderRadius: "3px",
                padding: "3px 12px",
                fontSize: "9px",
                fontWeight: 500,
                letterSpacing: "1.5px",
                color: "hsla(var(--clock-shadow), 0.7)",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "inset 0 1px 2px hsla(var(--clock-shadow), 0.15)",
                marginBottom: "8px",
              }}
            >
              {month}
            </div>

            {/* Date number - flip style */}
            <div
              style={{
                width: "100px",
                height: "80px",
                background: `linear-gradient(
                  180deg,
                  hsl(30, 5%, 90%) 0%,
                  hsl(30, 5%, 90%) 49.5%,
                  hsla(var(--clock-shadow), 0.1) 49.5%,
                  hsla(var(--clock-shadow), 0.1) 50.5%,
                  hsl(30, 5%, 88%) 50.5%,
                  hsl(30, 5%, 86%) 100%
                )`,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Playfair Display', serif",
                fontSize: "52px",
                fontWeight: 700,
                color: "hsla(var(--clock-shadow), 0.8)",
                boxShadow: `
                  inset 0 2px 4px hsla(var(--clock-shadow), 0.15),
                  0 1px 0 hsla(0, 0%, 100%, 0.2)
                `,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {date.toString().padStart(2, "0")}
            </div>

            {/* Day of week */}
            <div
              style={{
                background: "hsl(30, 5%, 78%)",
                borderRadius: "3px",
                padding: "3px 10px",
                fontSize: "8px",
                fontWeight: 500,
                letterSpacing: "1.2px",
                color: "hsla(var(--clock-shadow), 0.7)",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "inset 0 1px 2px hsla(var(--clock-shadow), 0.15)",
                marginTop: "8px",
              }}
            >
              {dayOfWeek}
            </div>

            {/* Side knobs */}
            <div
              className="absolute"
              style={{
                right: "-20px",
                top: "30%",
                width: "12px",
                height: "28px",
                background: `linear-gradient(
                  90deg,
                  hsl(30, 5%, 78%) 0%,
                  hsl(30, 5%, 84%) 40%,
                  hsl(30, 5%, 76%) 100%
                )`,
                borderRadius: "0 4px 4px 0",
                boxShadow: `
                  2px 2px 4px hsla(var(--clock-shadow), 0.2),
                  inset -1px 0 2px hsla(0, 0%, 100%, 0.2)
                `,
              }}
            />
            <div
              className="absolute"
              style={{
                right: "-20px",
                top: "55%",
                width: "12px",
                height: "28px",
                background: `linear-gradient(
                  90deg,
                  hsl(30, 5%, 78%) 0%,
                  hsl(30, 5%, 84%) 40%,
                  hsl(30, 5%, 76%) 100%
                )`,
                borderRadius: "0 4px 4px 0",
                boxShadow: `
                  2px 2px 4px hsla(var(--clock-shadow), 0.2),
                  inset -1px 0 2px hsla(0, 0%, 100%, 0.2)
                `,
              }}
            />
          </div>
        </div>

        {/* Wood surface */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          style={{
            width: "140%",
            height: "120px",
            background: `linear-gradient(
              180deg,
              hsl(25, 20%, 32%) 0%,
              hsl(25, 18%, 28%) 30%,
              hsl(25, 22%, 25%) 100%
            )`,
            borderRadius: "0",
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
};

export default DeskClock;
