import { useMemo } from "react";

interface RisingArrow {
  id: number;
  x: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  profit: number;
  curve: number;
}

const TradeProfitAnimation = () => {
  const arrows = useMemo(() => {
    const arrowsArray: RisingArrow[] = [];
    for (let i = 0; i < 25; i++) {
      arrowsArray.push({
        id: i,
        x: (i * 4.2) % 100,
        startY: 110 + (i * 6) % 120,
        size: 0.7 + Math.random() * 0.8,
        duration: 10 + Math.random() * 5,
        delay: i * 0.5,
        profit: 5 + Math.floor(Math.random() * 45),
        curve: -5 + Math.random() * 10,
      });
    }
    return arrowsArray;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <style>
        {`
          @keyframes riseWithCurve {
            0% {
              transform: translateY(0) translateX(0) scale(0.8);
              opacity: 0;
            }
            5% {
              opacity: 0.8;
            }
            50% {
              transform: translateY(-110px) translateX(var(--curve-x)) scale(1.1);
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-220px) translateX(0) scale(0.8);
              opacity: 0;
            }
          }
          
          @keyframes glowPulse {
            0%, 100% {
              opacity: 0.3;
              r: var(--glow-size);
            }
            50% {
              opacity: 0.6;
              r: calc(var(--glow-size) * 1.5);
            }
          }
          
          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .rising-arrow {
            animation: riseWithCurve ease-in-out infinite;
          }
          
          .arrow-glow {
            animation: glowPulse ease-in-out infinite;
          }
          
          .sparkle {
            animation: sparkle 2s ease-in-out infinite;
          }
        `}
      </style>
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 120" 
        preserveAspectRatio="none"
      >
        {/* Background trend lines */}
        <path
          d="M 0,100 Q 25,80 50,70 T 100,50"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.1"
          strokeDasharray="3,6"
          opacity="0.15"
        />
        
        <path
          d="M 0,90 Q 30,75 60,65 T 100,45"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.1"
          strokeDasharray="5,5"
          opacity="0.1"
        />

        {/* Rising profit arrows */}
        {arrows.map((arrow) => {
          const arrowLength = 10 * arrow.size;
          const headSize = 1.5 * arrow.size;
          
          return (
            <g
              key={arrow.id}
              className="rising-arrow"
              style={{
                '--curve-x': `${arrow.curve}px`,
                animationDuration: `${arrow.duration}s`,
                animationDelay: `${arrow.delay}s`,
              } as React.CSSProperties}
            >
              {/* Glow circle at base */}
              <circle
                cx={arrow.x}
                cy={arrow.startY}
                className="arrow-glow"
                fill="hsl(var(--primary))"
                style={{
                  '--glow-size': `${2 * arrow.size}px`,
                  animationDuration: `${arrow.duration * 0.3}s`,
                  animationDelay: `${arrow.delay}s`,
                } as React.CSSProperties}
              />
              
              {/* Arrow trail/shaft with gradient */}
              <line
                x1={arrow.x}
                y1={arrow.startY}
                x2={arrow.x}
                y2={arrow.startY - arrowLength}
                stroke="hsl(var(--primary))"
                strokeWidth={0.5 * arrow.size}
                strokeLinecap="round"
                opacity="0.8"
              />
              
              {/* Arrow head - triangle */}
              <path
                d={`
                  M ${arrow.x},${arrow.startY - arrowLength}
                  L ${arrow.x - headSize},${arrow.startY - arrowLength + headSize * 2}
                  L ${arrow.x + headSize},${arrow.startY - arrowLength + headSize * 2}
                  Z
                `}
                fill="hsl(var(--primary))"
                opacity="0.9"
              />
              
              {/* Profit percentage */}
              <text
                x={arrow.x}
                y={arrow.startY - arrowLength - 3}
                fontSize={2 * arrow.size}
                fill="hsl(var(--primary))"
                textAnchor="middle"
                fontWeight="bold"
                opacity="0.85"
              >
                +{arrow.profit}%
              </text>
              
              {/* Sparkle effects */}
              <circle
                cx={arrow.x}
                cy={arrow.startY - arrowLength * 0.5}
                r={0.3 * arrow.size}
                fill="hsl(var(--primary))"
                className="sparkle"
                style={{
                  animationDelay: `${arrow.delay + 0.5}s`,
                }}
              />
              
              <circle
                cx={arrow.x + 1.5}
                cy={arrow.startY - arrowLength * 0.7}
                r={0.25 * arrow.size}
                fill="hsl(var(--primary))"
                className="sparkle"
                style={{
                  animationDelay: `${arrow.delay + 0.7}s`,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default TradeProfitAnimation;

