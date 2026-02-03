import { motion } from 'framer-motion';
import type { CalculationResult } from '../../../utils/calculations';
import { formatCurrency, formatNumber } from '../../../utils/calculations';

interface ResultStepProps {
  result: CalculationResult;
  onRequestOffer: () => void;
}

export function ResultStep({ 
  result, 
  onRequestOffer,
}: ResultStepProps) {
  const {
    systemSize,
    panelCount,
    annualYield,
    annualSavings,
    totalInvestment,
    paybackPeriod,
    selfConsumption,
    autarkyRate,
    annualCO2Savings,
    storageKWh,
    savingsFromSelfConsumption,
    earningsFromFeedIn,
  } = result;

  // Monatliche Ersparnis
  const monthlyPayment = Math.round(annualSavings / 12);

  return (
    <div className="space-y-4">
      {/* Header mit Hauptergebnis */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-secondary mb-1">Ihr Solar-Ergebnis</h2>
        <p className="text-sm text-gray-500">Basierend auf Ihren Angaben</p>
      </div>

      {/* Hauptkennzahlen - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Amortisationszeit */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">Amortisation</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-secondary">{paybackPeriod}</span>
            <span className="text-sm text-gray-500">Jahre</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Bis zur Refinanzierung</p>
        </motion.div>

        {/* Jährliche Ersparnis */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 border border-green-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">Jährliche Ersparnis</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-green-600">{formatCurrency(annualSavings)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">≈ {formatCurrency(monthlyPayment)} / Monat</p>
        </motion.div>

        {/* Stromproduktion */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-4 border border-blue-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">Stromproduktion</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-600">{formatNumber(annualYield)}</span>
            <span className="text-sm text-gray-500">kWh/Jahr</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{autarkyRate}% Autarkie</p>
        </motion.div>

        {/* CO2 Ersparnis */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 rounded-xl p-4 border border-teal-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">CO₂ Ersparnis</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-teal-600">{formatNumber(annualCO2Savings / 1000, 1)}</span>
            <span className="text-sm text-gray-500">t/Jahr</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Für die Umwelt</p>
        </motion.div>
      </div>

      {/* Anlagen-Details */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-100 p-4"
      >
        <h3 className="text-sm font-semibold text-secondary mb-3">Ihre empfohlene Anlage</h3>
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-lg font-bold text-secondary">{systemSize}</span>
            <p className="text-xs text-gray-500">kWp Leistung</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-lg font-bold text-secondary">{panelCount}</span>
            <p className="text-xs text-gray-500">Module</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-lg font-bold text-secondary">{storageKWh}</span>
            <p className="text-xs text-gray-500">kWh Speicher</p>
          </div>
        </div>
      </motion.div>

      {/* Finanzielle Details */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl border border-gray-100 p-4"
      >
        <h3 className="text-sm font-semibold text-secondary mb-3">Finanzielle Übersicht</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Geschätzte Investition</span>
            <span className="font-medium text-secondary">{formatCurrency(totalInvestment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Eigenverbrauch-Ersparnis</span>
            <span className="font-medium text-green-600">+{formatCurrency(savingsFromSelfConsumption)}/Jahr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Einspeisevergütung</span>
            <span className="font-medium text-green-600">+{formatCurrency(earningsFromFeedIn)}/Jahr</span>
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-secondary">Gesamtersparnis pro Jahr</span>
              <span className="font-bold text-green-600">{formatCurrency(annualSavings)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hinweis */}
      <p className="text-xs text-gray-400 text-center">
        * Alle Angaben sind Schätzwerte. Das finale Angebot kann abweichen.
      </p>

      {/* CTA Button */}
      <motion.button
        onClick={onRequestOffer}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-primary hover:bg-primary-dark text-secondary font-semibold py-4 px-8 rounded-full shadow-md transition-all duration-200"
      >
        Kostenloses Angebot anfordern
      </motion.button>
    </div>
  );
}
