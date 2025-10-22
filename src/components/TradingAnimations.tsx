import { useEffect, useState } from "react";

const TradingAnimations = () => {
  const [activeIndicators, setActiveIndicators] = useState({
    bull: true,
    volume: 0,
    profit: 0,
  });

  useEffect(() => {
    // Animate trading switches
    const switchInterval = setInterval(() => {
      setActiveIndicators(prev => ({
        bull: Math.random() > 0.5,
        volume: Math.random() * 100,
        profit: Math.random() * 200 - 100,
      }));
    }, 2000);

    return () => clearInterval(switchInterval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {/* Trading Scales - Left Side */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground font-mono">
              {(100 + i * 20).toFixed(2)}
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden w-24">
              <div
                className={`h-full transition-all duration-1000 ${
                  activeIndicators.volume > i * 20
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
                style={{
                  width: `${Math.max(0, activeIndicators.volume - i * 20)}%`,
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Trading Scales - Right Side */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-row-reverse">
            <div className="text-xs text-muted-foreground font-mono">
              {(200 - i * 20).toFixed(2)}
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden w-24">
              <div
                className={`h-full transition-all duration-1000 ${
                  activeIndicators.profit > (4 - i) * 20 - 100
                    ? "gradient-bull"
                    : "gradient-bear"
                }`}
                style={{
                  width: `${Math.abs(activeIndicators.profit - ((4 - i) * 20 - 100))}%`,
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bull/Bear Switches - Top */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex gap-8">
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              activeIndicators.bull
                ? "border-primary bg-primary/20 shadow-glow scale-110"
                : "border-border bg-transparent scale-90"
            }`}
          >
            <svg
              className={`w-8 h-8 transition-colors duration-500 ${
                activeIndicators.bull ? "text-primary" : "text-muted-foreground"
              }`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-xs mt-2 text-primary font-bold">BULL</div>
        </div>

        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              !activeIndicators.bull
                ? "border-secondary bg-secondary/20 shadow-glow-red scale-110"
                : "border-border bg-transparent scale-90"
            }`}
          >
            <svg
              className={`w-8 h-8 transition-colors duration-500 ${
                !activeIndicators.bull ? "text-secondary" : "text-muted-foreground"
              }`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div className="text-xs mt-2 text-secondary font-bold">BEAR</div>
        </div>
      </div>

      {/* Floating Trade Indicators */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          >
            <div className="text-xs font-mono text-accent">
              {i % 2 === 0 ? "+" : "-"}
              {(Math.random() * 10).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingAnimations;
