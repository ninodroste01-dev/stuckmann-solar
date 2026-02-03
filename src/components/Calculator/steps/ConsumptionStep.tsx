import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EXTRA_CONSUMPTION } from '../../../utils/calculations';

interface ConsumptionStepProps {
  value: number;
  onChange: (value: number, extras?: { householdSize?: number; hasPool?: boolean; hasEV?: boolean; hasHeatPump?: boolean }) => void;
  householdSize?: number;
  hasPool?: boolean;
  hasEV?: boolean;
  hasHeatPump?: boolean;
}

// Familientypen mit geschätztem Jahresverbrauch
const FAMILY_TYPES = [
  {
    id: 'single',
    label: 'Single / Paar',
    description: '1-2 Personen',
    baseConsumption: 2500,
    householdSize: 1,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 'small',
    label: 'Kleine Familie',
    description: '3-4 Personen',
    baseConsumption: 4000,
    householdSize: 3,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'large',
    label: 'Große Familie',
    description: '5-6 Personen',
    baseConsumption: 5500,
    householdSize: 5,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'xlarge',
    label: 'Mehrgenerationen',
    description: '7+ Personen',
    baseConsumption: 7500,
    householdSize: 7,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
];

// Zusätzliche Verbraucher
const EXTRA_OPTIONS = [
  {
    id: 'pool',
    label: 'Pool',
    extraKWh: EXTRA_CONSUMPTION.POOL,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    id: 'ev',
    label: 'E-Auto',
    extraKWh: EXTRA_CONSUMPTION.EV,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'heatpump',
    label: 'Wärmepumpe',
    extraKWh: EXTRA_CONSUMPTION.HEAT_PUMP,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
  },
];

export function ConsumptionStep({ 
  value, 
  onChange, 
  householdSize: initialHouseholdSize = 3,
  hasPool: initialHasPool = false,
  hasEV: initialHasEV = false,
  hasHeatPump: initialHasHeatPump = false,
}: ConsumptionStepProps) {
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('small');
  const [hasPool, setHasPool] = useState(initialHasPool);
  const [hasEV, setHasEV] = useState(initialHasEV);
  const [hasHeatPump, setHasHeatPump] = useState(initialHasHeatPump);

  // Berechne den Gesamtverbrauch
  const calculateTotalConsumption = (familyId: string, pool: boolean, ev: boolean, heatPump: boolean) => {
    const family = FAMILY_TYPES.find(t => t.id === familyId);
    let total = family?.baseConsumption || 4000;
    if (pool) total += EXTRA_CONSUMPTION.POOL;
    if (ev) total += EXTRA_CONSUMPTION.EV;
    if (heatPump) total += EXTRA_CONSUMPTION.HEAT_PUMP;
    return total;
  };

  // Initialisiere den ausgewählten Familientyp basierend auf dem Wert
  useEffect(() => {
    // Finde die beste Übereinstimmung
    const baseValue = value 
      - (initialHasPool ? EXTRA_CONSUMPTION.POOL : 0)
      - (initialHasEV ? EXTRA_CONSUMPTION.EV : 0)
      - (initialHasHeatPump ? EXTRA_CONSUMPTION.HEAT_PUMP : 0);
    
    const closest = FAMILY_TYPES.reduce((prev, curr) => 
      Math.abs(curr.baseConsumption - baseValue) < Math.abs(prev.baseConsumption - baseValue) ? curr : prev
    );
    setSelectedFamilyId(closest.id);
    setHasPool(initialHasPool);
    setHasEV(initialHasEV);
    setHasHeatPump(initialHasHeatPump);
  }, []);

  const handleFamilySelect = (familyId: string) => {
    setSelectedFamilyId(familyId);
    const family = FAMILY_TYPES.find(t => t.id === familyId);
    const total = calculateTotalConsumption(familyId, hasPool, hasEV, hasHeatPump);
    onChange(total, {
      householdSize: family?.householdSize || 3,
      hasPool,
      hasEV,
      hasHeatPump,
    });
  };

  const handleExtraToggle = (extraId: string) => {
    let newPool = hasPool;
    let newEV = hasEV;
    let newHeatPump = hasHeatPump;

    if (extraId === 'pool') newPool = !hasPool;
    if (extraId === 'ev') newEV = !hasEV;
    if (extraId === 'heatpump') newHeatPump = !hasHeatPump;

    setHasPool(newPool);
    setHasEV(newEV);
    setHasHeatPump(newHeatPump);

    const family = FAMILY_TYPES.find(t => t.id === selectedFamilyId);
    const total = calculateTotalConsumption(selectedFamilyId, newPool, newEV, newHeatPump);
    onChange(total, {
      householdSize: family?.householdSize || 3,
      hasPool: newPool,
      hasEV: newEV,
      hasHeatPump: newHeatPump,
    });
  };

  const totalConsumption = calculateTotalConsumption(selectedFamilyId, hasPool, hasEV, hasHeatPump);
  const extraConsumption = (hasPool ? EXTRA_CONSUMPTION.POOL : 0) 
    + (hasEV ? EXTRA_CONSUMPTION.EV : 0) 
    + (hasHeatPump ? EXTRA_CONSUMPTION.HEAT_PUMP : 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-secondary">Haushaltsgröße</h2>
      </div>

      {/* Family Type Selection */}
      <div className="grid grid-cols-2 gap-2">
        {FAMILY_TYPES.map((familyType) => {
          const isSelected = selectedFamilyId === familyType.id;
          
          return (
            <motion.button
              key={familyType.id}
              onClick={() => handleFamilySelect(familyType.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-3 rounded-xl border-2 transition-all text-left
                ${isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Icon */}
              <div className={`mb-1 ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                {familyType.icon}
              </div>

              {/* Label */}
              <h3 className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                {familyType.label}
              </h3>
              
              {/* Description */}
              <p className="text-xs text-gray-400">
                {familyType.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Extra Options */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Zusätzliche Verbraucher</p>
        <div className="flex gap-2">
          {EXTRA_OPTIONS.map((option) => {
            const isActive = 
              (option.id === 'pool' && hasPool) ||
              (option.id === 'ev' && hasEV) ||
              (option.id === 'heatpump' && hasHeatPump);
            
            return (
              <motion.button
                key={option.id}
                onClick={() => handleExtraToggle(option.id)}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                  ${isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className={isActive ? 'text-primary' : 'text-gray-400'}>
                  {option.icon}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-600'}`}>
                  {option.label}
                </span>
                <span className="text-[10px] text-gray-400">
                  +{(option.extraKWh / 1000).toFixed(1)}k kWh
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Geschätzter Jahresverbrauch:</span>
          <span className="font-bold text-secondary text-lg">{totalConsumption.toLocaleString('de-DE')} kWh</span>
        </div>
        {extraConsumption > 0 && (
          <p className="text-xs text-gray-400 mt-1 text-right">
            inkl. +{extraConsumption.toLocaleString('de-DE')} kWh für Extras
          </p>
        )}
      </div>
    </div>
  );
}
