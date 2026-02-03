import { motion } from 'framer-motion';
import type { RoofType, Orientation } from './HouseVisualizer';

interface SolarPanelsProps {
  roofType: RoofType;
  roofAngle: number;
  panelCount: number;
  orientation: Orientation;
  houseScale?: number;
  baseY?: number;
  houseHeight?: number;
  houseX?: number;
  houseWidth?: number;
}

export function SolarPanels({ 
  roofType, 
  roofAngle, 
  panelCount, 
  orientation,
  houseScale = 1,
  baseY = 320,
  houseHeight = 100,
  houseX = 130,
  houseWidth = 140,
}: SolarPanelsProps) {
  const angleScale = roofAngle / 45;
  const roofHeight = (35 + angleScale * 25) * houseScale;
  const wallTop = baseY - houseHeight;

  // Calculate efficiency based on orientation (affects glow intensity)
  const orientationEfficiency: Record<Orientation, number> = {
    'S': 1.0,
    'SO': 0.95,
    'SW': 0.95,
    'O': 0.85,
    'W': 0.85,
    'NO': 0.7,
    'NW': 0.7,
    'N': 0.6,
  };

  const efficiency = orientationEfficiency[orientation];

  // Generate panel positions based on roof type
  const getPanelPositions = () => {
    const panels: { x: number; y: number; width: number; height: number; rotate: number }[] = [];
    
    // Panel size scaled to house
    const panelWidth = 16 * houseScale;
    const panelHeight = 10 * houseScale;
    const gap = 2 * houseScale;
    
    // Calculate available panels per row based on roof width
    const maxPanelsPerRow = Math.floor((houseWidth * 0.4) / (panelWidth + gap));
    const panelsPerRow = roofType === 'pultdach' ? Math.min(maxPanelsPerRow * 2, 6) : Math.min(maxPanelsPerRow, 4);
    const maxRows = 3;
    const displayPanels = Math.min(panelCount, panelsPerRow * maxRows);
    const rows = Math.ceil(displayPanels / panelsPerRow);

    for (let row = 0; row < rows; row++) {
      const panelsInThisRow = Math.min(panelsPerRow, displayPanels - row * panelsPerRow);
      
      for (let col = 0; col < panelsInThisRow; col++) {
        let x: number, y: number, rotate: number;
        
        const roofStartY = wallTop - roofHeight * 0.3;
        
        switch (roofType) {
          case 'satteldach':
            // Panels on left roof side, properly positioned
            const leftRoofStartX = houseX + 5;
            x = leftRoofStartX + col * (panelWidth + gap) + row * (6 * houseScale);
            y = roofStartY + row * (panelHeight + gap) - row * (4 * houseScale);
            rotate = -roofAngle * 0.35;
            break;
            
          case 'flachdach':
            // Panels on flat roof, centered
            const flatRoofCenterX = houseX + houseWidth / 2;
            const totalRowWidth = panelsInThisRow * (panelWidth + gap) - gap;
            x = flatRoofCenterX - totalRowWidth / 2 + col * (panelWidth + gap);
            y = wallTop - 15 + row * (panelHeight + gap + 3);
            rotate = 15; // Slightly tilted for optimal angle on flat roof
            break;
            
          case 'pultdach':
            // Panels spread across single sloped roof
            const pultStartX = houseX + 10;
            x = pultStartX + col * (panelWidth + gap);
            y = wallTop - roofHeight * 0.6 + row * (panelHeight + gap);
            rotate = -roofAngle * 0.25;
            break;
            
          case 'walmdach':
            // Panels on front face of hip roof
            const walmStartX = houseX + houseWidth * 0.2;
            x = walmStartX + col * (panelWidth + gap) + row * (4 * houseScale);
            y = wallTop - roofHeight * 0.35 + row * (panelHeight + gap);
            rotate = -roofAngle * 0.3;
            break;
            
          default:
            x = houseX + 10 + col * (panelWidth + gap);
            y = wallTop - 30 + row * (panelHeight + gap);
            rotate = 0;
        }
        
        panels.push({ x, y, width: panelWidth, height: panelHeight, rotate });
      }
    }
    
    return panels;
  };

  const panels = getPanelPositions();

  return (
    <g>
      <defs>
        <linearGradient id="solarPanelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="30%" stopColor="#2C5282" />
          <stop offset="70%" stopColor="#1E3A5F" />
          <stop offset="100%" stopColor="#152A45" />
        </linearGradient>
        
        <linearGradient id="panelShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <filter id="panelGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.5" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {panels.map((panel, index) => (
        <motion.g
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: index * 0.04,
            duration: 0.25,
            type: "spring",
            stiffness: 250 
          }}
          style={{
            transformOrigin: `${panel.x + panel.width / 2}px ${panel.y + panel.height / 2}px`,
          }}
        >
          {/* Panel frame */}
          <rect
            x={panel.x - 1}
            y={panel.y - 1}
            width={panel.width + 2}
            height={panel.height + 2}
            fill="#263238"
            rx="1"
            transform={`rotate(${panel.rotate} ${panel.x + panel.width / 2} ${panel.y + panel.height / 2})`}
          />
          
          {/* Panel body */}
          <rect
            x={panel.x}
            y={panel.y}
            width={panel.width}
            height={panel.height}
            fill="url(#solarPanelGradient)"
            rx="0.5"
            transform={`rotate(${panel.rotate} ${panel.x + panel.width / 2} ${panel.y + panel.height / 2})`}
            filter="url(#panelGlow)"
          />
          
          {/* Grid lines - solar cell pattern */}
          <g 
            stroke="#1a365d" 
            strokeWidth="0.3"
            transform={`rotate(${panel.rotate} ${panel.x + panel.width / 2} ${panel.y + panel.height / 2})`}
          >
            {/* Vertical lines */}
            <line x1={panel.x + panel.width / 3} y1={panel.y} x2={panel.x + panel.width / 3} y2={panel.y + panel.height} />
            <line x1={panel.x + (panel.width * 2) / 3} y1={panel.y} x2={panel.x + (panel.width * 2) / 3} y2={panel.y + panel.height} />
            {/* Horizontal line */}
            <line x1={panel.x} y1={panel.y + panel.height / 2} x2={panel.x + panel.width} y2={panel.y + panel.height / 2} />
          </g>
          
          {/* Shine effect */}
          <rect
            x={panel.x}
            y={panel.y}
            width={panel.width}
            height={panel.height}
            fill="url(#panelShine)"
            rx="0.5"
            transform={`rotate(${panel.rotate} ${panel.x + panel.width / 2} ${panel.y + panel.height / 2})`}
          />

          {/* Energy glow effect based on efficiency */}
          <motion.rect
            x={panel.x - 1.5}
            y={panel.y - 1.5}
            width={panel.width + 3}
            height={panel.height + 3}
            fill="none"
            stroke="#FFD93D"
            strokeWidth="1"
            rx="1.5"
            opacity={0}
            transform={`rotate(${panel.rotate} ${panel.x + panel.width / 2} ${panel.y + panel.height / 2})`}
            animate={{
              opacity: [0, efficiency * 0.4, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: index * 0.08,
            }}
          />
        </motion.g>
      ))}

      {/* Panel count indicator - positioned nicely */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <rect
          x={houseX + houseWidth + 15}
          y={wallTop - roofHeight * 0.5}
          width="38"
          height="22"
          rx="4"
          fill="rgba(30, 58, 95, 0.95)"
        />
        <text
          x={houseX + houseWidth + 34}
          y={wallTop - roofHeight * 0.5 + 15}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
        >
          {panelCount}×
        </text>
      </motion.g>
    </g>
  );
}
