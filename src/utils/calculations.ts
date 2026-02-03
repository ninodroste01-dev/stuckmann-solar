import type { RoofType, Orientation } from '../components/HouseVisualizer';

// Constants for PV calculations - Preise basierend auf Stuckmann Solar Angeboten 2025
export const PV_CONSTANTS = {
  // Solar irradiation in Germany (kWh/m²/year)
  SOLAR_IRRADIATION: 1000,
  
  // Module efficiency (modern panels - Trina Vertex S+)
  MODULE_EFFICIENCY: 0.20,
  
  // System losses (cables, inverter, etc.)
  SYSTEM_LOSSES: 0.15,
  
  // Current electricity price (€/kWh) - Germany average 2026
  ELECTRICITY_PRICE: 0.3194,
  
  // Feed-in tariff (€/kWh) - EEG 2026
  FEED_IN_TARIFF: 0.0811,
  
  // Self-consumption rate without storage
  SELF_CONSUMPTION_NO_STORAGE: 0.30,
  
  // Self-consumption rate with storage (alle Pakete haben Speicher!)
  SELF_CONSUMPTION_WITH_STORAGE: 0.70,
  
  // CO2 savings per kWh (kg)
  CO2_SAVINGS_PER_KWH: 0.627,
  
  // Watts per panel (Trina Glas-Glas TSM-450NEG9R.28 Vertex S+)
  WATTS_PER_PANEL: 450,
  
  // Area per panel (m²)
  AREA_PER_PANEL: 1.7,
  
  // Legacy - nicht mehr verwendet, aber für Kompatibilität
  PRICE_PER_KWP: 1400,
  STORAGE_PRICE_PER_KWH: 0,
};

// Stuckmann Solar Komplettpakete (netto, inkl. Montage, Anmeldung und Speicher!)
export const STUCKMANN_PACKAGES = [
  {
    id: 'small-5',
    name: '6,3 kWp mit 5 kWh Speicher',
    kWp: 6.3,
    panels: 14,
    storageKWh: 5,
    price: 10645,
    description: '14x Trina Glas-Glas TSM-450NEG9R.28 Vertex S+',
    inverter: 'Huawei Sun 2000 6 KTL M1',
    storage: 'Huawei Luna 2000 5 kWh',
  },
  {
    id: 'medium-5',
    name: '9 kWp mit 5 kWh Speicher',
    kWp: 9,
    panels: 20,
    storageKWh: 5,
    price: 12600,
    description: '20x Trina Glas-Glas TSM-450NEG9R.28 Vertex S+',
    inverter: 'Huawei Sun 2000 8 KTL M1',
    storage: 'Huawei Luna 2000 5 kWh',
  },
  {
    id: 'medium-10',
    name: '9 kWp mit 10 kWh Speicher',
    kWp: 9,
    panels: 20,
    storageKWh: 10,
    price: 14400,
    description: '20x Trina Glas-Glas TSM-450NEG9R.28 Vertex S+',
    inverter: 'Huawei Sun 2000 8 KTL M1',
    storage: 'Huawei Luna 2000 10 kWh',
  },
  {
    id: 'large-5',
    name: '10,8 kWp mit 5 kWh Speicher',
    kWp: 10.8,
    panels: 24,
    storageKWh: 5,
    price: 14220,
    description: '24x Trina Glas-Glas TSM-450NEG9R.28 Vertex S+',
    inverter: 'Huawei Sun 2000 10 KTL M1',
    storage: 'Huawei Luna 2000 5 kWh',
  },
  {
    id: 'large-10',
    name: '10,8 kWp mit 10 kWh Speicher',
    kWp: 10.8,
    panels: 24,
    storageKWh: 10,
    price: 16020,
    description: '24x Trina Glas-Glas TSM-450NEG9R.28 Vertex S+',
    inverter: 'Huawei Sun 2000 10 KTL M1',
    storage: 'Huawei Luna 2000 10 kWh',
  },
  {
    id: 'fullblack-5',
    name: '10,68 kWp mit 5 kWh Speicher (Full Black)',
    kWp: 10.68,
    panels: 24,
    storageKWh: 5,
    price: 14220,
    description: '24x Trina Glas-Glas Full Black TSM-445NEG9R.25',
    inverter: 'Huawei Sun 2000 10 KTL M1',
    storage: 'Huawei Luna 2000 5 kWh',
    fullBlack: true,
  },
  {
    id: 'fullblack-10',
    name: '10,68 kWp mit 10 kWh Speicher (Full Black)',
    kWp: 10.68,
    panels: 24,
    storageKWh: 10,
    price: 16020,
    description: '24x Trina Glas-Glas Full Black TSM-445NEG9R.25',
    inverter: 'Huawei Sun 2000 10 KTL M1',
    storage: 'Huawei Luna 2000 10 kWh',
    fullBlack: true,
  },
];

// Zusätzlicher Stromverbrauch durch Extras (kWh/Jahr)
export const EXTRA_CONSUMPTION = {
  POOL: 3000,      // Pool mit Pumpe und evtl. Heizung
  EV: 2500,        // Elektroauto (ca. 15.000 km/Jahr bei 17 kWh/100km)
  HEAT_PUMP: 4000, // Wärmepumpe (je nach Größe und Isolierung)
};

// Finde das passende Stuckmann Paket basierend auf der berechneten kWp
export function findBestPackage(systemSizeKWp: number, preferLargerStorage = true) {
  // Sortiere Pakete nach kWp
  const sortedPackages = [...STUCKMANN_PACKAGES]
    .filter(p => !p.fullBlack) // Nur Standard-Pakete für automatische Auswahl
    .sort((a, b) => a.kWp - b.kWp);
  
  // Finde das kleinste Paket das >= systemSizeKWp ist
  let bestPackage = sortedPackages.find(p => p.kWp >= systemSizeKWp);
  
  // Falls kein passendes gefunden, nimm das größte
  if (!bestPackage) {
    bestPackage = sortedPackages[sortedPackages.length - 1];
  }
  
  // Wenn größerer Speicher bevorzugt wird, suche nach 10kWh Variante
  if (preferLargerStorage && bestPackage.storageKWh === 5) {
    const largerStoragePackage = STUCKMANN_PACKAGES.find(
      p => p.kWp === bestPackage!.kWp && p.storageKWh === 10 && !p.fullBlack
    );
    if (largerStoragePackage) {
      return largerStoragePackage;
    }
  }
  
  return bestPackage;
}

// Orientation factors (relative to optimal south-facing)
export const ORIENTATION_FACTORS: Record<Orientation, number> = {
  'S': 1.00,
  'SO': 0.95,
  'SW': 0.95,
  'O': 0.85,
  'W': 0.85,
  'NO': 0.70,
  'NW': 0.70,
  'N': 0.60,
};

// Angle factors (optimal is around 30-35 degrees in Germany)
export function getAngleFactor(angle: number): number {
  // Optimal angle range
  const optimalAngle = 32;
  const deviation = Math.abs(angle - optimalAngle);
  
  // Factor decreases with deviation from optimal
  if (deviation <= 10) return 1.0;
  if (deviation <= 20) return 0.95;
  if (deviation <= 30) return 0.90;
  if (deviation <= 45) return 0.80;
  return 0.70;
}

// Roof type factors (accounts for usable area and complexity)
export const ROOF_TYPE_FACTORS: Record<RoofType, number> = {
  'satteldach': 0.85,
  'flachdach': 0.90, // Can optimize angle
  'pultdach': 0.95, // Larger uninterrupted surface
  'walmdach': 0.75, // Less usable area due to shape
};

export interface CalculationInput {
  roofType: RoofType;
  roofAngle: number;
  orientation: Orientation;
  roofSize: number; // m²
  annualConsumption: number; // kWh
  wantsStorage: boolean;
  storageSize: number; // kWh
}

export interface CalculationResult {
  // System specifications
  systemSize: number; // kWp
  panelCount: number;
  usableRoofArea: number; // m²
  
  // Energy production
  annualYield: number; // kWh
  
  // Financial results
  selfConsumption: number; // kWh
  gridFeedIn: number; // kWh
  annualSavings: number; // €
  savingsFromSelfConsumption: number; // €
  earningsFromFeedIn: number; // €
  
  // Investment
  systemCost: number; // €
  storageCost: number; // €
  totalInvestment: number; // €
  
  // ROI
  paybackPeriod: number; // years
  returnOn20Years: number; // €
  
  // Environmental
  annualCO2Savings: number; // kg
  lifetimeCO2Savings: number; // kg (25 years)
  
  // Rates
  selfConsumptionRate: number; // %
  autarkyRate: number; // % of own consumption covered
  
  // Efficiency factors used
  orientationFactor: number;
  angleFactor: number;
  roofTypeFactor: number;
  
  // Zusätzliche Felder für erweiterte Darstellung
  feedInTariff?: number; // € jährliche Einspeisevergütung
  operatingCosts?: number; // € jährliche Betriebskosten
  annualConsumption?: number; // kWh jährlicher Verbrauch
  
  // Stuckmann Paket-Infos
  packageName?: string;
  packageDescription?: string;
  inverter?: string;
  storage?: string;
  storageKWh?: number;
}

export function calculatePVSystem(input: CalculationInput): CalculationResult {
  const {
    roofType,
    roofAngle,
    orientation,
    roofSize,
    annualConsumption,
  } = input;

  // Get efficiency factors
  const orientationFactor = ORIENTATION_FACTORS[orientation];
  const angleFactor = getAngleFactor(roofAngle);
  const roofTypeFactor = ROOF_TYPE_FACTORS[roofType];

  // Calculate usable roof area
  const usableRoofArea = roofSize * roofTypeFactor;

  // Calculate number of panels that would fit
  const maxPanelCount = Math.floor(usableRoofArea / PV_CONSTANTS.AREA_PER_PANEL);
  
  // Calculate theoretical system size (kWp)
  const theoreticalSystemSize = (maxPanelCount * PV_CONSTANTS.WATTS_PER_PANEL) / 1000;

  // Finde das passende Stuckmann Paket (immer mit Speicher!)
  // Wähle 10kWh Speicher für größere Anlagen, 5kWh für kleinere
  const preferLargerStorage = annualConsumption > 5000;
  const bestPackage = findBestPackage(theoreticalSystemSize, preferLargerStorage);
  
  // Verwende die Paket-Werte
  const systemSize = bestPackage.kWp;
  const panelCount = bestPackage.panels;
  const storageSize = bestPackage.storageKWh;

  // Calculate annual yield (kWh) basierend auf dem Paket
  const rawYield = systemSize * PV_CONSTANTS.SOLAR_IRRADIATION;
  const adjustedYield = rawYield * orientationFactor * angleFactor;
  const annualYield = adjustedYield * (1 - PV_CONSTANTS.SYSTEM_LOSSES);

  // Alle Pakete haben Speicher - nutze entsprechende Selbstverbrauchsrate
  const selfConsumptionRate = PV_CONSTANTS.SELF_CONSUMPTION_WITH_STORAGE;

  // Self-consumption is limited by actual consumption
  const potentialSelfConsumption = annualYield * selfConsumptionRate;
  const selfConsumption = Math.min(potentialSelfConsumption, annualConsumption);

  // Grid feed-in
  const gridFeedIn = annualYield - selfConsumption;

  // Financial calculations
  const savingsFromSelfConsumption = selfConsumption * PV_CONSTANTS.ELECTRICITY_PRICE;
  const earningsFromFeedIn = gridFeedIn * PV_CONSTANTS.FEED_IN_TARIFF;
  const annualSavings = savingsFromSelfConsumption + earningsFromFeedIn;

  // Investment costs - direkt vom Stuckmann Paket (inkl. Speicher!)
  const totalInvestment = bestPackage.price;
  const systemCost = totalInvestment; // Komplettpreis
  const storageCost = 0; // Im Paketpreis enthalten

  // Payback period
  const paybackPeriod = annualSavings > 0 ? totalInvestment / annualSavings : 99;

  // 20-year return (assuming constant values, simplified)
  const returnOn20Years = annualSavings * 20 - totalInvestment;

  // Autarky rate (% of consumption covered by PV)
  const autarkyRate = annualConsumption > 0 
    ? (selfConsumption / annualConsumption) * 100 
    : 0;

  // CO2 savings
  const annualCO2Savings = annualYield * PV_CONSTANTS.CO2_SAVINGS_PER_KWH;
  const lifetimeCO2Savings = annualCO2Savings * 25;

  // Jährliche Betriebskosten (ca. 1-2% der Investition)
  const operatingCosts = totalInvestment * 0.015;
  
  return {
    systemSize: Math.round(systemSize * 10) / 10,
    panelCount,
    usableRoofArea: Math.round(usableRoofArea),
    annualYield: Math.round(annualYield),
    selfConsumption: Math.round(selfConsumption),
    gridFeedIn: Math.round(gridFeedIn),
    annualSavings: Math.round(annualSavings),
    savingsFromSelfConsumption: Math.round(savingsFromSelfConsumption),
    earningsFromFeedIn: Math.round(earningsFromFeedIn),
    systemCost: Math.round(systemCost),
    storageCost: Math.round(storageCost),
    totalInvestment: Math.round(totalInvestment),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    returnOn20Years: Math.round(returnOn20Years),
    selfConsumptionRate: Math.round(selfConsumptionRate * 100),
    autarkyRate: Math.round(autarkyRate),
    annualCO2Savings: Math.round(annualCO2Savings),
    lifetimeCO2Savings: Math.round(lifetimeCO2Savings),
    orientationFactor,
    angleFactor,
    roofTypeFactor,
    feedInTariff: Math.round(earningsFromFeedIn),
    operatingCosts: Math.round(operatingCosts),
    annualConsumption,
    // Zusätzliche Paket-Infos
    packageName: bestPackage.name,
    packageDescription: bestPackage.description,
    inverter: bestPackage.inverter,
    storage: bestPackage.storage,
    storageKWh: storageSize,
  };
}

// Helper to get recommended system size based on consumption
export function getRecommendedSystemSize(annualConsumption: number): number {
  // Rule of thumb: 1 kWp per 1000 kWh consumption
  return Math.ceil(annualConsumption / 1000);
}

// Helper to get recommended storage size
export function getRecommendedStorageSize(systemSize: number): number {
  // Rule of thumb: 1 kWh storage per 1 kWp
  return Math.ceil(systemSize);
}

// Format currency for display
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

// Format number with German locale
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: decimals,
  }).format(value);
}
