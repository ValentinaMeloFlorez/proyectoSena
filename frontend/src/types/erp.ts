export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  stockThreshold: number;
  lowStock: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  code: string;
  name: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  stockThreshold?: number;
}

export interface ProductListResponse {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: string;
  quantity: number;
  previousStock: number;
  resultingStock: number;
  reason: string;
  performedBy: string;
  performedAt: string;
}

export interface InventoryListResponse {
  items: InventoryMovement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InvoiceItem {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  subTotal: number;
  taxAmount: number;
  total: number;
  issuedAt: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFormData {
  clientId: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
}

export interface InvoiceListResponse {
  items: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IncomeEntry {
  id: string;
  concept: string;
  value: number;
  date: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseEntry {
  id: string;
  concept: string;
  value: number;
  date: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialListResponse {
  items: IncomeEntry[] | ExpenseEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardMetrics {
  totalSales: number;
  totalClients: number;
  totalProducts: number;
  totalSuppliers: number;
  totalIncome: number;
  totalExpenses: number;
  lowStockProducts: number;
  recentInvoices: Invoice[];
}

export interface AIPredictionRequest {
  history: number[];
  companyId?: string;
}

export interface AIPredictionResponse {
  prediction: number;
  confidence: number;
  horizon: string;
  notes?: string;
}

export interface AIAnomaly {
  index: number;
  date?: string;
  value: number;
  score: number;
}

export interface AIAnomalyResponse {
  count: number;
  total: number;
  anomalies: AIAnomaly[];
}

export interface AIRecommendationResponse {
  recommendedActions: string[];
  focusAreas: string[];
  confidence: number;
}

export interface AISmartAlert {
  severity: "info" | "warning" | "critical";
  message: string;
  code: string;
}

export interface AISmartAlertResponse {
  alerts: AISmartAlert[];
  timestamp?: string;
}
