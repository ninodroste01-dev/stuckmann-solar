import { motion } from 'framer-motion';
import type { Orientation } from './HouseVisualizer';

interface SunProps {
  x: number;
  y: number;
  orientation: Orientation;
}

export function Sun({ x, y, orientation }: SunProps) {
  // Sun is brighter when facing south
  const southFacing = ['S', 'SO', 'SW'].includes(orientation);
  const intensity = southFacing ? 1 : 0.7;

  // Zentrum der Sonne
  const centerX = x;
  const centerY = y;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: intensity, 
        scale: 1,
      }}
      transition={{ duration: 0.5 }}
      style={{ transformOrigin: `${centerX}px ${centerY}px` }}
    >
      {/* Sun rays */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${centerX}px ${centerY}px` }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.line
            key={i}
            x1={centerX}
            y1={centerY - 32}
            x2={centerX}
            y2={centerY - 24}
            stroke="#FFD93D"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              transformOrigin: `${centerX}px ${centerY}px`,
              transform: `rotate(${i * 30}deg)`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              strokeWidth: [2, 4, 2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.g>

      {/* Sun body */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="18"
        fill="url(#sunGradient)"
        filter="url(#sunGlow)"
        animate={{
          r: [18, 20, 18],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sun face (optional cute detail) */}
      <g opacity="0.3">
        <circle cx={centerX - 5} cy={centerY - 2} r="2" fill="#FF8C00" />
        <circle cx={centerX + 5} cy={centerY - 2} r="2" fill="#FF8C00" />
        <path
          d={`M ${centerX - 5} ${centerY + 4} Q ${centerX} ${centerY + 8} ${centerX + 5} ${centerY + 4}`}
          stroke="#FF8C00"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Intensity indicator */}
      {southFacing && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <circle cx={centerX} cy={centerY} r="28" fill="none" stroke="#FFD93D" strokeWidth="2" opacity="0.3" />
          <circle cx={centerX} cy={centerY} r="34" fill="none" stroke="#FFD93D" strokeWidth="1" opacity="0.2" />
        </motion.g>
      )}
    </motion.g>
  );
}
