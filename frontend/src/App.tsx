import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { Dashboard } from "@/pages/Dashboard";
import { UserListPage } from "@/pages/users/UserListPage";
import { UserFormPage } from "@/pages/users/UserFormPage";
import { ProductListPage } from "@/pages/products/ProductListPage";
import { ProductFormPage } from "@/pages/products/ProductFormPage";
import { InventoryPage } from "@/pages/inventory/InventoryPage";
import { InvoiceListPage } from "@/pages/invoices/InvoiceListPage";
import { InvoiceFormPage } from "@/pages/invoices/InvoiceFormPage";
import { IncomeListPage } from "@/pages/income/IncomeListPage";
import { IncomeFormPage } from "@/pages/income/IncomeFormPage";
import { ExpenseListPage } from "@/pages/expenses/ExpenseListPage";
import { ExpenseFormPage } from "@/pages/expenses/ExpenseFormPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { AIPage } from "@/pages/ai/AIPage";
import { NotFound } from "@/pages/NotFound";
import { Unauthorized } from "@/pages/Unauthorized";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="users:manage" />}>
          <Route element={<MainLayout />}>
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/new" element={<UserFormPage />} />
            <Route path="/users/:id/edit" element={<UserFormPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="products:read" />}>
          <Route element={<MainLayout />}>
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id/edit" element={<ProductFormPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="inventory:read" />}>
          <Route element={<MainLayout />}>
            <Route path="/inventory" element={<InventoryPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="invoices:read" />}>
          <Route element={<MainLayout />}>
            <Route path="/invoicing" element={<InvoiceListPage />} />
            <Route path="/invoicing/new" element={<InvoiceFormPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="income:read" />}>
          <Route element={<MainLayout />}>
            <Route path="/income" element={<IncomeListPage />} />
            <Route path="/income/new" element={<IncomeFormPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="expenses:read" />}>
          <Route element={<MainLayout />}>
            <Route path="/expenses" element={<ExpenseListPage />} />
            <Route path="/expenses/new" element={<ExpenseFormPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="reports:read" />}>
          <Route element={<MainLayout />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="ai:use" />}>
          <Route element={<MainLayout />}>
            <Route path="/ai" element={<AIPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
