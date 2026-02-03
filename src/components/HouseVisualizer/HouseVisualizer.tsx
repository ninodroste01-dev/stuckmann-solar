import { motion } from 'framer-motion';
import { useMemo } from 'react';

export type RoofType = 'satteldach' | 'flachdach' | 'pultdach' | 'walmdach';
export type Orientation = 'N' | 'NO' | 'O' | 'SO' | 'S' | 'SW' | 'W' | 'NW';

interface EnergyData {
  erzeugung: number; // kWh pro Jahr
  hausverbrauch: number; // kWh pro Jahr
  netzbezug: number; // kWh pro Jahr
  speichernutzung: number; // kWh pro Jahr
  co2Ersparnis: number; // kg pro Jahr
  autarkie: number; // Prozent
}

interface HouseVisualizerProps {
  roofType: RoofType;
  roofAngle: number;
  orientation: Orientation;
  roofSize: number;
  showPanels?: boolean;
  householdSize?: number;
  hasPool?: boolean;
  hasEV?: boolean;
  hasHeatPump?: boolean;
  hasStorage?: boolean;
  // Neue Props für Energiedaten
  energyData?: EnergyData;
  showEnergyFlow?: boolean;
}

export function HouseVisualizer({
  roofType,
  roofAngle,
  orientation,
  roofSize,
  showPanels = true,
  householdSize = 3,
  hasPool: _hasPool = false,
  hasEV: _hasEV = false,
  hasHeatPump: _hasHeatPump = false,
  hasStorage = false,
  energyData,
  showEnergyFlow = false,
}: HouseVisualizerProps) {
  // Unused variables - kept for future feature extension
  void _hasPool;
  void _hasEV;
  void _hasHeatPump;
  // Calculate number of panels based on roof size
  const panelCount = useMemo(() => {
    const panelArea = 1.7;
    return Math.floor(roofSize / panelArea);
  }, [roofSize]);

  // Formatierung für Zahlen
  const formatNumber = (num: number) => {
    return num.toLocaleString('de-DE', { maximumFractionDigits: 2 });
  };

  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col items-center justify-start bg-[#F9FAFB] rounded-2xl overflow-hidden p-6">
      {/* Titel */}
      {showEnergyFlow && energyData && (
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-secondary">
            Jährliche Durchschnittswerte für
          </h3>
          <h3 className="text-lg font-semibold text-secondary">
            Energieproduktion und Verbrauch
          </h3>
        </div>
      )}

      <svg 
        className="w-full flex-1" 
        viewBox="0 0 400 320" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient für Solarpanels */}
          <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#2A4F7A" />
          </linearGradient>
        </defs>

        {/* === SONNE === */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Sonnenkörper */}
          <circle cx="200" cy="45" r="16" fill="#FFB800" />
          {/* Sonnenstrahlen */}
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={i}
              x1="200"
              y1="20"
              x2="200"
              y2="12"
              stroke="#FFB800"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                transformOrigin: '200px 45px',
                transform: `rotate(${i * 45}deg)`,
              }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.g>

        {/* === ENERGIEFLUSS LABELS (wenn aktiv) === */}
        {showEnergyFlow && energyData && (
          <>
            {/* Erzeugung Label (oben rechts von Sonne) */}
            <g>
              <text x="250" y="55" fontSize="11" fill="#1E3A5F" fontWeight="600">Erzeugung</text>
              <text x="250" y="72" fontSize="13" fill="#F5A623" fontWeight="700">
                {formatNumber(energyData.erzeugung)} kWh
              </text>
            </g>

            {/* Netzbezug Label (links oben) */}
            <g>
              {/* Strommasten-Icon */}
              <g transform="translate(55, 75)">
                <line x1="0" y1="0" x2="0" y2="35" stroke="#F5A623" strokeWidth="2" />
                <line x1="-8" y1="8" x2="8" y2="8" stroke="#F5A623" strokeWidth="2" />
                <line x1="-6" y1="18" x2="6" y2="18" stroke="#F5A623" strokeWidth="2" />
                <line x1="-4" y1="28" x2="4" y2="28" stroke="#F5A623" strokeWidth="2" />
              </g>
              <text x="40" y="125" fontSize="11" fill="#1E3A5F" fontWeight="600">Netzbezug</text>
              <text x="40" y="142" fontSize="13" fill="#10B981" fontWeight="700">
                {formatNumber(energyData.netzbezug)} kWh
              </text>
            </g>

            {/* Speichernutzung Label (links unten) */}
            {hasStorage && (
              <g>
                {/* Batterie-Icon */}
                <g transform="translate(40, 175)">
                  <rect x="0" y="0" width="30" height="45" rx="3" fill="none" stroke="#10B981" strokeWidth="2" />
                  <rect x="8" y="-4" width="14" height="6" rx="1" fill="#10B981" />
                  <motion.rect 
                    x="4" y="35" width="22" height="6" rx="1" fill="#10B981"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <rect x="4" y="26" width="22" height="6" rx="1" fill="#10B981" />
                  <rect x="4" y="17" width="22" height="6" rx="1" fill="#10B981" opacity="0.5" />
                </g>
                <text x="25" y="235" fontSize="10" fill="#1E3A5F" fontWeight="600">Speichernutzung</text>
                <text x="25" y="250" fontSize="12" fill="#10B981" fontWeight="700">
                  {formatNumber(energyData.speichernutzung)} kWh
                </text>
              </g>
            )}

            {/* CO2 Ersparnis (rechts) */}
            <g>
              {/* Blatt-Icon */}
              <g transform="translate(335, 145)">
                <path 
                  d="M15 5 C5 5 0 15 0 25 C0 35 10 40 15 40 C15 40 15 25 15 25 C15 25 25 30 25 20 C25 10 20 5 15 5" 
                  fill="#10B981" 
                  opacity="0.8"
                />
                <line x1="15" y1="25" x2="15" y2="40" stroke="#10B981" strokeWidth="2" />
              </g>
              <text x="320" y="200" fontSize="10" fill="#1E3A5F" fontWeight="600" textAnchor="middle">CO₂ Ersparnis</text>
              <text x="320" y="217" fontSize="12" fill="#10B981" fontWeight="700" textAnchor="middle">
                {formatNumber(energyData.co2Ersparnis)} kg
              </text>
            </g>

            {/* Energiefluss-Linien */}
            {/* Von Sonne zum Haus */}
            <motion.path
              d="M200 65 L200 120"
              stroke="#FFB800"
              strokeWidth="2"
              strokeDasharray="6 4"
              fill="none"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Vom Netz zum Haus */}
            <motion.path
              d="M80 130 Q120 145 140 160"
              stroke="#F5A623"
              strokeWidth="2"
              strokeDasharray="6 4"
              fill="none"
              opacity="0.6"
            />
            
            {/* Vom Speicher zum Haus */}
            {hasStorage && (
              <motion.path
                d="M75 215 Q110 210 135 195"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </>
        )}

        {/* === HAUS (minimalistisch) === */}
        <g transform="translate(115, 115)">
          {/* Dach mit Solarpanels */}
          {roofType === 'satteldach' && (
            <>
              {/* Linke Dachhälfte */}
              <path 
                d="M0 65 L85 0 L85 65 Z" 
                fill="#E8E8E8" 
                stroke="#D0D0D0" 
                strokeWidth="1"
              />
              {/* Rechte Dachhälfte */}
              <path 
                d="M85 0 L170 65 L85 65 Z" 
                fill="#F0F0F0" 
                stroke="#D0D0D0" 
                strokeWidth="1"
              />
              {/* Solarpanels auf linker Dachseite */}
              {showPanels && (
                <g>
                  {[...Array(Math.min(panelCount, 6))].map((_, i) => {
                    const row = Math.floor(i / 3);
                    const col = i % 3;
                    const x = 12 + col * 22 + row * 8;
                    const y = 25 + row * 16;
                    return (
                      <motion.rect
                        key={i}
                        x={x}
                        y={y}
                        width="18"
                        height="12"
                        fill="url(#solarGradient)"
                        rx="1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        transform={`rotate(-22 ${x + 9} ${y + 6})`}
                      />
                    );
                  })}
                </g>
              )}
            </>
          )}
          
          {roofType === 'flachdach' && (
            <>
              <rect x="0" y="55" width="170" height="12" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="1" />
              {showPanels && (
                <g>
                  {[...Array(Math.min(panelCount, 8))].map((_, i) => {
                    const x = 10 + (i % 4) * 40;
                    const y = 35 + Math.floor(i / 4) * 14;
                    return (
                      <motion.rect
                        key={i}
                        x={x}
                        y={y}
                        width="32"
                        height="10"
                        fill="url(#solarGradient)"
                        rx="1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        transform={`rotate(12 ${x + 16} ${y + 5})`}
                      />
                    );
                  })}
                </g>
              )}
            </>
          )}

          {roofType === 'pultdach' && (
            <>
              <path 
                d="M0 50 L0 65 L170 65 L170 20 Z" 
                fill="#E8E8E8" 
                stroke="#D0D0D0" 
                strokeWidth="1"
              />
              {showPanels && (
                <g>
                  {[...Array(Math.min(panelCount, 8))].map((_, i) => {
                    const x = 15 + (i % 4) * 38;
                    const y = 30 + Math.floor(i / 4) * 14;
                    return (
                      <motion.rect
                        key={i}
                        x={x}
                        y={y}
                        width="30"
                        height="10"
                        fill="url(#solarGradient)"
                        rx="1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        transform={`rotate(-10 ${x + 15} ${y + 5})`}
                      />
                    );
                  })}
                </g>
              )}
            </>
          )}

          {roofType === 'walmdach' && (
            <>
              <path 
                d="M0 65 L40 20 L130 20 L170 65 Z" 
                fill="#E8E8E8" 
                stroke="#D0D0D0" 
                strokeWidth="1"
              />
              {showPanels && (
                <g>
                  {[...Array(Math.min(panelCount, 6))].map((_, i) => {
                    const x = 45 + (i % 3) * 28;
                    const y = 28 + Math.floor(i / 3) * 14;
                    return (
                      <motion.rect
                        key={i}
                        x={x}
                        y={y}
                        width="22"
                        height="10"
                        fill="url(#solarGradient)"
                        rx="1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                      />
                    );
                  })}
                </g>
              )}
            </>
          )}

          {/* Hauswand */}
          <rect x="5" y="65" width="160" height="95" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="1" />
          
          {/* Fenster links */}
          <rect x="20" y="80" width="35" height="30" fill="#B8D4E8" stroke="#A0C4D8" strokeWidth="1" rx="2" />
          <line x1="37.5" y1="80" x2="37.5" y2="110" stroke="#A0C4D8" strokeWidth="1" />
          <line x1="20" y1="95" x2="55" y2="95" stroke="#A0C4D8" strokeWidth="1" />
          
          {/* Fenster rechts */}
          <rect x="115" y="80" width="35" height="30" fill="#B8D4E8" stroke="#A0C4D8" strokeWidth="1" rx="2" />
          <line x1="132.5" y1="80" x2="132.5" y2="110" stroke="#A0C4D8" strokeWidth="1" />
          <line x1="115" y1="95" x2="150" y2="95" stroke="#A0C4D8" strokeWidth="1" />
          
          {/* Tür */}
          <rect x="70" y="115" width="30" height="45" fill="#C9A86C" stroke="#B8976B" strokeWidth="1" rx="2" />
          <circle cx="92" cy="138" r="2.5" fill="#8B7355" />
          
          {/* Schornstein */}
          {roofType !== 'flachdach' && (
            <rect x="125" y="-5" width="15" height="30" fill="#A0A0A0" stroke="#909090" strokeWidth="1" rx="1" />
          )}
        </g>

        {/* Rauch Animation */}
        {roofType !== 'flachdach' && (
          <motion.g
            animate={{ y: [-2, -8, -2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="247" cy="100" rx="6" ry="4" fill="#D0D0D0" />
            <ellipse cx="250" cy="92" rx="4" ry="3" fill="#D0D0D0" opacity="0.6" />
          </motion.g>
        )}

        {/* Boden / Gras */}
        <rect x="0" y="275" width="400" height="45" fill="#E8F5E9" />
        <line x1="0" y1="275" x2="400" y2="275" stroke="#C8E6C9" strokeWidth="2" />

        {/* Kleine Büsche/Pflanzen */}
        <ellipse cx="100" cy="278" rx="20" ry="10" fill="#81C784" />
        <ellipse cx="300" cy="278" rx="15" ry="8" fill="#81C784" />

        {/* Hausverbrauch Label (unter dem Haus) */}
        {showEnergyFlow && energyData && (
          <g>
            <text x="200" y="295" fontSize="11" fill="#1E3A5F" fontWeight="600" textAnchor="middle">
              Hausverbrauch
            </text>
            <text x="200" y="312" fontSize="13" fill="#F5A623" fontWeight="700" textAnchor="middle">
              {formatNumber(energyData.hausverbrauch)} kWh
            </text>
          </g>
        )}
      </svg>

      {/* Autarkie-Anzeige */}
      {showEnergyFlow && energyData && (
        <div className="w-full max-w-xs mt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-secondary font-medium">Autarkie</span>
            <span className="text-2xl font-bold text-primary">{energyData.autarkie} %</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${energyData.autarkie}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Info-Badges (wenn nicht Energiefluss-Modus) */}
      {!showEnergyFlow && (
        <>
          {/* Ausrichtung */}
          <div className="absolute bottom-3 right-3 bg-white rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
              <span className="text-xs font-semibold text-secondary">{orientation}</span>
            </div>
          </div>

          {/* Dachneigung */}
          <div className="absolute bottom-3 left-3 bg-white rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-semibold text-secondary">{roofAngle}°</span>
            </div>
          </div>

          {/* Haushaltsgröße */}
          <div className="absolute top-3 left-3 bg-white rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs font-semibold text-secondary">{householdSize} {householdSize === 1 ? 'Person' : 'Personen'}</span>
            </div>
          </div>

          {/* Module-Anzahl */}
          {showPanels && (
            <div className="absolute top-3 right-3 bg-secondary text-white rounded-lg px-2.5 py-1.5 shadow-sm">
              <span className="text-xs font-semibold">{Math.min(panelCount, 20)} Module</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
