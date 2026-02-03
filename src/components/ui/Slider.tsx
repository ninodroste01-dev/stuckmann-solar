import { motion } from 'framer-motion';
import type { InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  showValue?: boolean;
  marks?: { value: number; label: string }[];
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  showValue = true,
  marks,
  onChange,
  className = '',
  ...props
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <label className="text-sm font-medium text-secondary">
              {label}
            </label>
          )}
          {showValue && (
            <motion.span
              key={value}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-primary"
            >
              {value}{unit}
            </motion.span>
          )}
        </div>
      )}
      
      <div className="relative">
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          style={{ margin: 0 }}
          {...props}
        />
        
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-lg border-2 border-white pointer-events-none"
          initial={false}
          animate={{ left: `calc(${percentage}% - 12px)` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {marks && marks.length > 0 && (
        <div className="relative mt-2 h-6">
          {marks.map((mark) => {
            const markPercentage = ((mark.value - min) / (max - min)) * 100;
            return (
              <div
                key={mark.value}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${markPercentage}%` }}
              >
                <div className="w-1 h-2 bg-gray-300 mx-auto" />
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {mark.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
