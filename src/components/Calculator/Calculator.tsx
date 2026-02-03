import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HouseVisualizer, type RoofType, type Orientation } from '../HouseVisualizer';
import { Button, Card } from '../ui';
import { StepIndicator } from './StepIndicator';
import { ContactForm } from './ContactForm';
import {
  RoofTypeStep,
  RoofAngleStep,
  OrientationStep,
  RoofSizeStep,
  PostalCodeStep,
  ConsumptionStep,
  ResultStep,
  OwnershipStep,
} from './steps';
import { 
  calculatePVSystem, 
  type CalculationInput,
  type CalculationResult 
} from '../../utils/calculations';

type Step = 'roofType' | 'roofAngle' | 'orientation' | 'roofSize' | 'consumption' | 'postalCode' | 'ownership' | 'result' | 'contact';

const STEPS: Step[] = ['roofType', 'roofAngle', 'orientation', 'roofSize', 'consumption', 'postalCode', 'ownership', 'result'];

// Step Labels wurden entfernt - nur Nummern werden angezeigt

export function Calculator() {
  // Form state
  const [currentStep, setCurrentStep] = useState<Step>('roofType');
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [roofType, setRoofType] = useState<RoofType>('satteldach');
  const [roofAngle, setRoofAngle] = useState(30);
  const [orientation, setOrientation] = useState<Orientation>('S');
  const [roofSize, setRoofSize] = useState(50);
  const [postalCode, setPostalCode] = useState('');
  const [consumption, setConsumption] = useState(4000);
  const [showContactForm, setShowContactForm] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  
  // Zusätzliche Verbraucher State (aus ConsumptionStep)
  const [householdSize, setHouseholdSize] = useState(3);
  const [hasPool, setHasPool] = useState(false);
  const [hasEV, setHasEV] = useState(false);
  const [hasHeatPump, setHasHeatPump] = useState(false);

  // Calculate current step index
  const currentStepIndex = showContactForm ? STEPS.length : STEPS.indexOf(currentStep) + 1;
  
  // Ist es der Ergebnis-Schritt?
  const isResultStep = currentStep === 'result';

  // Calculation input - Speicher ist bei Stuckmann immer dabei!
  const calculationInput: CalculationInput = useMemo(() => ({
    roofType,
    roofAngle: roofType === 'flachdach' ? 15 : roofAngle,
    orientation,
    roofSize,
    annualConsumption: consumption,
    wantsStorage: true, // Immer true - alle Pakete haben Speicher
    storageSize: 10, // Wird automatisch basierend auf Paket gewählt
  }), [roofType, roofAngle, orientation, roofSize, consumption]);

  // Calculate result
  const calculationResult: CalculationResult = useMemo(
    () => calculatePVSystem(calculationInput),
    [calculationInput]
  );

  // Energiedaten für die Visualisierung
  const energyData = useMemo(() => ({
    erzeugung: calculationResult.annualYield,
    hausverbrauch: consumption,
    netzbezug: Math.max(0, consumption - calculationResult.selfConsumption),
    speichernutzung: calculationResult.annualYield * 0.2, // Immer mit Speicher
    co2Ersparnis: calculationResult.annualCO2Savings,
    autarkie: calculationResult.autarkyRate,
  }), [calculationResult, consumption]);

  // Navigation handlers
  const goToNextStep = () => {
    const stepIndex = STEPS.indexOf(currentStep);
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (showContactForm) {
      setShowContactForm(false);
      return;
    }
    const stepIndex = STEPS.indexOf(currentStep);
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1]);
    }
  };

  const handleRequestOffer = () => {
    setShowContactForm(true);
  };

  const handleSubmitSuccess = () => {
    setSubmissionComplete(true);
  };

  // Handle consumption changes from ConsumptionStep
  const handleConsumptionChange = (value: number, extras?: { householdSize?: number; hasPool?: boolean; hasEV?: boolean; hasHeatPump?: boolean }) => {
    setConsumption(value);
    if (extras) {
      if (extras.householdSize !== undefined) setHouseholdSize(extras.householdSize);
      if (extras.hasPool !== undefined) setHasPool(extras.hasPool);
      if (extras.hasEV !== undefined) setHasEV(extras.hasEV);
      if (extras.hasHeatPump !== undefined) setHasHeatPump(extras.hasHeatPump);
    }
  };

  // Check if current step can proceed
  const canProceed = () => {
    switch (currentStep) {
      case 'roofType':
        return !!roofType;
      case 'roofAngle':
        return roofAngle >= 0;
      case 'orientation':
        return !!orientation;
      case 'roofSize':
        return roofSize > 0;
      case 'consumption':
        return consumption > 0;
      case 'postalCode':
        return postalCode.length === 5;
      case 'ownership':
        return isOwner !== null;
      default:
        return true;
    }
  };

  // Render current step content
  const renderStepContent = () => {
    if (showContactForm) {
      return (
        <ContactForm
          calculationInput={calculationInput}
          calculationResult={calculationResult}
          onSubmitSuccess={handleSubmitSuccess}
          onBack={goToPreviousStep}
        />
      );
    }

    switch (currentStep) {
      case 'roofType':
        return <RoofTypeStep value={roofType} onChange={setRoofType} />;
      case 'roofAngle':
        return <RoofAngleStep value={roofAngle} onChange={setRoofAngle} roofType={roofType} />;
      case 'orientation':
        return <OrientationStep value={orientation} onChange={setOrientation} />;
      case 'roofSize':
        return <RoofSizeStep value={roofSize} onChange={setRoofSize} />;
      case 'consumption':
        return (
          <ConsumptionStep 
            value={consumption} 
            onChange={handleConsumptionChange}
            householdSize={householdSize}
            hasPool={hasPool}
            hasEV={hasEV}
            hasHeatPump={hasHeatPump}
          />
        );
      case 'postalCode':
        return <PostalCodeStep value={postalCode} onChange={setPostalCode} />;
      case 'ownership':
        return <OwnershipStep value={isOwner} onChange={setIsOwner} />;
      case 'result':
        return (
          <ResultStep
            result={calculationResult}
            onRequestOffer={handleRequestOffer}
            roofType={roofType}
            roofAngle={roofType === 'flachdach' ? 5 : roofAngle}
            orientation={orientation}
            roofSize={roofSize}
            hasStorage={true}
          />
        );
      default:
        return null;
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - White background with inputs */}
        <div className="w-full lg:w-1/2 bg-white min-h-screen flex flex-col relative z-10">

        {/* Calculator Content */}
        <div className="flex-1 px-8 py-8 overflow-y-auto flex items-center justify-center">
          <div className="max-w-md w-full">
            {/* Step Indicator */}
            {!submissionComplete && (
              <div className="mb-8">
                <StepIndicator
                  currentStep={currentStepIndex}
                  totalSteps={STEPS.length}
                />
              </div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={showContactForm ? 'contact' : currentStep}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="min-h-[350px]"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {!showContactForm && currentStep !== 'result' && !submissionComplete && (
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                {currentStep !== 'roofType' && (
                  <Button
                    variant="outline"
                    onClick={goToPreviousStep}
                    className="flex-1"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    }
                  >
                    Zurück
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={goToNextStep}
                  disabled={!canProceed()}
                  className={`${currentStep === 'roofType' ? 'w-full' : 'flex-1'}`}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  }
                  iconPosition="right"
                >
                  {currentStep === 'ownership' ? 'Berechnen' : 'Weiter'}
                </Button>
              </div>
            )}

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>SSL-verschlüsselt</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9/5</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Kostenlos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-8 py-4 text-center text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} Stuckmann Solar GmbH · 
            <a href="https://www.stuckmann-solar.de/impressum/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors mx-1">Impressum</a>
            · 
            <a href="https://www.stuckmann-solar.de/datenschutzerklaerung/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors mx-1">Datenschutz</a>
          </p>
        </footer>
      </div>

      {/* Right side - Background image with visualizer overlay */}
      <div 
        className="w-full lg:w-1/2 min-h-screen relative hidden lg:flex flex-col"
        style={{
          backgroundImage: `url('/images/Stuckmann-Solar- für den rechner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/70 via-secondary/50 to-secondary/30" />
        
        {/* Content over the background - centered */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
          {/* Visualizer Card - centered */}
          <div className="w-full max-w-xl">
            <Card variant="elevated" padding="none" className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl">
              <HouseVisualizer
                roofType={roofType}
                roofAngle={roofType === 'flachdach' ? 5 : roofAngle}
                orientation={orientation}
                roofSize={roofSize}
                showPanels={currentStepIndex >= 5}
                householdSize={householdSize}
                hasPool={hasPool}
                hasEV={hasEV}
                hasHeatPump={hasHeatPump}
                hasStorage={currentStepIndex >= 5}
                showEnergyFlow={isResultStep}
                energyData={isResultStep ? energyData : undefined}
              />
            </Card>
            
            {/* Live calculation preview - directly below */}
            {currentStepIndex >= 5 && !isResultStep && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4"
              >
                <h4 className="text-sm font-semibold text-gray-500 mb-3 text-center">Live-Vorschau</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{calculationResult.systemSize.toFixed(1)}</p>
                    <p className="text-xs text-gray-400">kWp Anlagengröße</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">{Math.round(calculationResult.annualYield).toLocaleString('de-DE')}</p>
                    <p className="text-xs text-gray-400">kWh/Jahr</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Show visualizer below the form */}
      <div className="lg:hidden w-full bg-gray-50 p-4">
        <Card variant="elevated" padding="none" className="overflow-hidden bg-white">
          <HouseVisualizer
            roofType={roofType}
            roofAngle={roofType === 'flachdach' ? 5 : roofAngle}
            orientation={orientation}
            roofSize={roofSize}
            showPanels={currentStepIndex >= 5}
            householdSize={householdSize}
            hasPool={hasPool}
            hasEV={hasEV}
            hasHeatPump={hasHeatPump}
                hasStorage={currentStepIndex >= 5}
            showEnergyFlow={isResultStep}
            energyData={isResultStep ? energyData : undefined}
          />
        </Card>
        
        {/* Mobile Live preview */}
        {currentStepIndex >= 5 && !isResultStep && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4"
          >
            <h4 className="text-sm font-semibold text-gray-500 mb-3">Live-Vorschau</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{calculationResult.systemSize.toFixed(1)}</p>
                <p className="text-xs text-gray-400">kWp Anlagengröße</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{Math.round(calculationResult.annualYield).toLocaleString('de-DE')}</p>
                <p className="text-xs text-gray-400">kWh/Jahr</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      </div>

    </div>
  );
}
