import { useMemo } from "react";

interface Candle {
  id: number;
  x: number;
  baseY: number;
  height: number;
  isBullish: boolean;
  delay: number;
  duration: number;
}

const CandlestickAnimation = () => {
  const candles = useMemo(() => {
    const candlesArray: Candle[] = [];
    for (let i = 0; i < 25; i++) {
      candlesArray.push({
        id: i,
        x: 2 + (i * 4),
        baseY: 50,
        height: 8 + Math.random() * 18,
        isBullish: Math.random() > 0.5,
        delay: i * 0.15,
        duration: 3 + Math.random() * 2,
      });
    }
    return candlesArray;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <style>
        {`
          @keyframes candlePulse {
            0%, 100% { 
              transform: scaleY(1);
              opacity: 0.7;
            }
            50% { 
              transform: scaleY(1.15);
              opacity: 1;
            }
          }
          
          @keyframes wickGlow {
            0%, 100% { 
              opacity: 0.3;
            }
            50% { 
              opacity: 0.8;
            }
          }

          @keyframes chartLineMove {
            0% {
              stroke-dashoffset: 100;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          
          .candle-body {
            animation: candlePulse ease-in-out infinite;
          }
          
          .candle-wick {
            animation: wickGlow ease-in-out infinite;
          }

          .chart-line {
            animation: chartLineMove 4s linear infinite;
          }
        `}
      </style>
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        {/* Animated chart line */}
        <path
          d="M 0,60 Q 20,40 40,55 T 80,45 Q 90,50 100,40"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.2"
          strokeDasharray="2,2"
          opacity="0.4"
          className="chart-line"
        />
        
        <path
          d="M 0,70 Q 25,65 50,60 T 100,55"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.15"
          strokeDasharray="3,3"
          opacity="0.3"
          className="chart-line"
          style={{ animationDelay: '2s' }}
        />

        {/* Candles */}
        {candles.map((candle) => {
          const topY = candle.isBullish ? candle.baseY - candle.height : candle.baseY;
          const wickTop = candle.baseY - candle.height - 4;
          const wickBottom = candle.baseY + 4;
          
          return (
            <g key={candle.id}>
              {/* Wick */}
              <line
                x1={candle.x}
                y1={wickTop}
                x2={candle.x}
                y2={wickBottom}
                stroke={candle.isBullish ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
                strokeWidth="0.15"
                className="candle-wick"
                style={{
                  animationDuration: `${candle.duration}s`,
                  animationDelay: `${candle.delay}s`,
                }}
              />
              
              {/* Body */}
              <rect
                x={candle.x - 0.7}
                y={topY}
                width="1.4"
                height={candle.height}
                fill={candle.isBullish ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
                rx="0.2"
                className="candle-body"
                style={{
                  transformOrigin: `${candle.x}px ${candle.baseY}px`,
                  animationDuration: `${candle.duration}s`,
                  animationDelay: `${candle.delay}s`,
                }}
              />
              
              {/* Glow effect */}
              <rect
                x={candle.x - 0.9}
                y={topY - 0.3}
                width="1.8"
                height={candle.height + 0.6}
                fill={candle.isBullish ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
                opacity="0.15"
                rx="0.3"
                className="candle-body"
                style={{
                  transformOrigin: `${candle.x}px ${candle.baseY}px`,
                  animationDuration: `${candle.duration}s`,
                  animationDelay: `${candle.delay}s`,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CandlestickAnimation;

