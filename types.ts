
export interface PromptTemplate {
  id: string;
  name: string;
  version: string;
  system: string;
  user_template: string;
  expected_format: string;
  min_items: number;
  max_items: number;
}

export interface ExtractedItem {
  keyword: string;
  quote: string;
  confidence?: number;
}

export interface Paper {
  id: string;
  fileName: string;
  fullText: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
}

export interface AnalysisResult {
  paperId: string;
  promptId: string;
  rawResponse: string;
  parsedItems: ExtractedItem[];
  timestamp: string;
  model: string;
  errors?: string[];
}

export enum ViewState {
  Dashboard = 'dashboard',
  Papers = 'papers',
  Prompts = 'prompts',
  Results = 'results'
}
