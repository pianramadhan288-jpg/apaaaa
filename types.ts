
export enum BrokerCategory {
  RICH = 'Rich/Institusi',
  KONGLO = 'Konglo Spesial',
  AMPAS = 'Ritel',
  CAMPUR = 'Campur'
}

export interface BrokerInfo {
  code: string;
  name: string;
  category: BrokerCategory;
  description: string;
}

export interface AnalysisInput {
  ticker: string;
  price: number;
  avgPrice: number;
  orderBook: 'Buy Dominan' | 'Sell Dominan';
  tradeBook: 'Buy Dominan' | 'Sell Dominan';
  brokerSummary: number; // 0 to 100
  topBrokers: string[];
}

export interface PublicStockData {
  name: string;
  address: string;
  directors: string[];
  ownership: string;
  corporateAction: string;
  financialSummary: string;
  marketData: string;
  sources: string[];
}

export interface AnalysisResult {
  signalTemplate: string;
  recommendation: string;
  riskColor: 'red' | 'yellow' | 'green';
  riskExplanation: string;
  timeframe: string;
  strategy: 'Day Trade' | 'Swing Trade' | 'Wait & Watch';
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
  brokerDetails: BrokerInfo[];
  avgComparison: string;
}
