import { useMemo } from "react";

interface DataParticle {
  id: number;
  startX: number;
  startY: number;
  value: string;
  duration: number;
  delay: number;
  pathType: number;
}

const DataFlowAnimation = () => {
  const particles = useMemo(() => {
    const particlesArray: DataParticle[] = [];
    const symbols = ["BTC", "ETH", "EUR", "USD", "₿", "Ξ", "$", "€"];
    const values = ["↑", "↓", "+", "•", "○"];
    
    for (let i = 0; i < 30; i++) {
      const useSymbol = i % 2 === 0;
      particlesArray.push({
        id: i,
        startX: Math.random() * 100,
        startY: -10 - Math.random() * 20,
        value: useSymbol 
          ? symbols[Math.floor(Math.random() * symbols.length)]
          : `${values[Math.floor(Math.random() * values.length)]}${(Math.random() * 99).toFixed(0)}`,
        duration: 12 + Math.random() * 8,
        delay: i * 0.6,
        pathType: Math.floor(Math.random() * 3),
      });
    }
    return particlesArray;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <style>
        {`
          @keyframes dataFloat1 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translate(10px, 120px) rotate(360deg);
              opacity: 0;
            }
          }
          
          @keyframes dataFloat2 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.9;
            }
            90% {
              opacity: 0.9;
            }
            100% {
              transform: translate(-15px, 120px) rotate(-360deg);
              opacity: 0;
            }
          }
          
          @keyframes dataFloat3 {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.7;
            }
            50% {
              transform: translate(5px, 60px) scale(1.3);
            }
            90% {
              opacity: 0.7;
            }
            100% {
              transform: translate(-5px, 120px) scale(1);
              opacity: 0;
            }
          }

          @keyframes dataStream {
            0% {
              stroke-dashoffset: 100;
              opacity: 0.2;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 0.2;
            }
          }
          
          .data-particle-1 {
            animation: dataFloat1 linear infinite;
          }
          
          .data-particle-2 {
            animation: dataFloat2 linear infinite;
          }
          
          .data-particle-3 {
            animation: dataFloat3 linear infinite;
          }

          .data-stream {
            animation: dataStream 3s ease-in-out infinite;
          }
        `}
      </style>
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 120" 
        preserveAspectRatio="none"
      >
        {/* Data streams */}
        <path
          d="M 10,0 Q 15,40 20,60 T 30,100"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.1"
          strokeDasharray="5,5"
          className="data-stream"
        />
        
        <path
          d="M 50,0 L 50,120"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.1"
          strokeDasharray="3,7"
          className="data-stream"
          style={{ animationDelay: '1s' }}
        />
        
        <path
          d="M 80,0 Q 75,40 70,60 T 65,100"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.1"
          strokeDasharray="5,5"
          className="data-stream"
          style={{ animationDelay: '2s' }}
        />

        {/* Flowing data particles */}
        {particles.map((particle) => (
          <text
            key={particle.id}
            x={particle.startX}
            y={particle.startY}
            fontSize={particle.value.length > 3 ? "1.8" : "2.5"}
            fill="hsl(var(--primary))"
            textAnchor="middle"
            fontWeight="bold"
            className={`data-particle-${(particle.pathType % 3) + 1}`}
            style={{
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            {particle.value}
          </text>
        ))}
        
        {/* Decorative dots */}
        {[...Array(15)].map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx={(i * 7) % 100}
            cy={10 + (i * 15) % 100}
            r="0.3"
            fill="hsl(var(--primary))"
            opacity="0.4"
            className="animate-pulse"
            style={{
              animationDuration: '3s',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default DataFlowAnimation;

