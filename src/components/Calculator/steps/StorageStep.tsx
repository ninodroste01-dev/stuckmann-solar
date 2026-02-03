import { motion } from 'framer-motion';
import { PV_CONSTANTS } from '../../../utils/calculations';

interface StorageStepProps {
  wantsStorage: boolean;
  storageSize: number;
  onWantsStorageChange: (value: boolean) => void;
  onStorageSizeChange: (value: number) => void;
  recommendedSize: number;
  moduleCount?: number;
}

// Huawei Luna 2000 Speicheroptionen von Stuckmann Solar
const STORAGE_OPTIONS = [
  {
    id: 'none',
    size: 0,
    label: 'Kein Speicher',
    price: 0,
    selfConsumption: 30,
    description: 'Überschuss wird eingespeist',
  },
  {
    id: '5kwh',
    size: 5,
    label: 'Huawei Luna 2000',
    price: PV_CONSTANTS.STORAGE_PRICE_5KWH,
    selfConsumption: 50,
    description: '5 kWh Kapazität',
  },
  {
    id: '10kwh',
    size: 10,
    label: 'Huawei Luna 2000',
    price: PV_CONSTANTS.STORAGE_PRICE_10KWH,
    selfConsumption: 70,
    description: '10 kWh Kapazität',
  },
  {
    id: '15kwh',
    size: 15,
    label: 'Huawei Luna 2000',
    price: PV_CONSTANTS.STORAGE_PRICE_15KWH,
    selfConsumption: 80,
    description: '15 kWh Kapazität',
  },
];

export function StorageStep({
  wantsStorage,
  storageSize,
  onWantsStorageChange,
  onStorageSizeChange,
  recommendedSize,
}: StorageStepProps) {
  
  const handleSelect = (option: typeof STORAGE_OPTIONS[0]) => {
    if (option.size === 0) {
      onWantsStorageChange(false);
      onStorageSizeChange(0);
    } else {
      onWantsStorageChange(true);
      onStorageSizeChange(option.size);
    }
  };

  const currentSelection = wantsStorage 
    ? STORAGE_OPTIONS.find(o => o.size === storageSize) || STORAGE_OPTIONS[1]
    : STORAGE_OPTIONS[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-secondary">Stromspeicher</h2>
          <p className="text-xs text-gray-400">Huawei Luna 2000 Serie</p>
        </div>
      </div>

      {/* Storage Options */}
      <div className="space-y-3">
        {STORAGE_OPTIONS.map((option) => {
          const isSelected = currentSelection.id === option.id;
          const isRecommended = option.size === recommendedSize || 
            (option.size === 10 && recommendedSize >= 8 && recommendedSize <= 12);
          
          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`
                relative w-full p-4 rounded-xl border-2 transition-all text-left
                ${isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {/* Recommended Badge */}
              {isRecommended && option.size > 0 && (
                <span className="absolute -top-2 right-3 px-2 py-0.5 bg-primary text-white text-[10px] font-semibold rounded-full">
                  Empfohlen
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Radio Button */}
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}
                  `}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    option.size === 0 ? 'bg-gray-100' : 'bg-primary/10'
                  }`}>
                    {option.size === 0 ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    )}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                      {option.size === 0 ? option.label : `${option.size} kWh Speicher`}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {option.size === 0 ? option.description : option.label}
                    </p>
                  </div>
                </div>

                {/* Right side info */}
                <div className="text-right">
                  {option.size > 0 && (
                    <p className="text-sm font-semibold text-secondary">
                      +{option.price.toLocaleString('de-DE')} €
                    </p>
                  )}
                  <p className={`text-xs ${option.size === 0 ? 'text-gray-400' : 'text-primary'}`}>
                    {option.selfConsumption}% Eigenverbrauch
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className={`rounded-xl p-4 ${wantsStorage ? 'bg-primary/5 border border-primary/20' : 'bg-gray-50'}`}>
        <div className="flex items-start gap-3">
          <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${wantsStorage ? 'text-primary' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600">
            {wantsStorage 
              ? `Mit einem ${storageSize} kWh Speicher können Sie Ihren selbst erzeugten Strom auch abends und nachts nutzen und erhöhen Ihren Eigenverbrauch deutlich.`
              : 'Ohne Speicher wird überschüssiger Strom ins Netz eingespeist. Sie erhalten dafür eine Einspeisevergütung.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
