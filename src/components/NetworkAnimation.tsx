import { useMemo } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const NetworkAnimation = () => {
  const nodes = useMemo(() => {
    const nodeList: Node[] = [];
    // Create a mesh network pattern
    for (let i = 0; i < 9; i++) {
      nodeList.push({
        id: i,
        x: 20 + (i % 3) * 30,
        y: 25 + Math.floor(i / 3) * 25,
        size: 0.5 + Math.random() * 0.4,
        delay: i * 0.4,
      });
    }
    return nodeList;
  }, []);

  const connections = useMemo(() => {
    const connList: Array<{ from: Node; to: Node; delay: number }> = [];
    // Connect nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i < j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          // Only connect if close enough
          if (distance < 35) {
            connList.push({
              from: node,
              to: otherNode,
              delay: (i + j) * 0.2,
            });
          }
        }
      });
    });
    return connList;
  }, [nodes]);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.2] pointer-events-none">
      <style>
        {`
          @keyframes networkPulse {
            0%, 100% {
              r: var(--base-size);
              opacity: 0.3;
            }
            50% {
              r: calc(var(--base-size) * 1.1);
              opacity: 0.5;
            }
          }
          
          @keyframes connectionFlow {
            0% {
              stroke-dashoffset: 50;
              opacity: 0.15;
            }
            50% {
              opacity: 0.3;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 0.15;
            }
          }
          
          @keyframes energyPulse {
            0% {
              offset-distance: 0%;
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.6;
            }
            100% {
              offset-distance: 100%;
              opacity: 0;
            }
          }
          
          .network-node {
            animation: networkPulse 3s ease-in-out infinite;
          }
          
          .network-connection {
            animation: connectionFlow 4s linear infinite;
          }
          
          .energy-dot {
            animation: energyPulse 3s ease-in-out infinite;
          }
        `}
      </style>
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          {/* Glow filter */}
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map((conn, i) => (
          <g key={`conn-${i}`}>
            <line
              x1={conn.from.x}
              y1={conn.from.y}
              x2={conn.to.x}
              y2={conn.to.y}
              stroke="hsl(var(--primary))"
              strokeWidth="0.08"
              strokeDasharray="2,5"
              className="network-connection"
              style={{
                animationDelay: `${conn.delay}s`,
              }}
            />
          </g>
        ))}
        
        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Outer glow ring */}
            <circle
              cx={node.x}
              cy={node.y}
              className="network-node"
              fill="hsl(var(--primary))"
              opacity="0.08"
              style={{
                '--base-size': `${node.size * 1.5}px`,
                animationDelay: `${node.delay}s`,
                animationDuration: '4s',
              } as React.CSSProperties}
            />
            
            {/* Main node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="hsl(var(--primary))"
              className="network-node"
              opacity="0.5"
              style={{
                '--base-size': `${node.size}px`,
                animationDelay: `${node.delay}s`,
                animationDuration: '4s',
              } as React.CSSProperties}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default NetworkAnimation;

