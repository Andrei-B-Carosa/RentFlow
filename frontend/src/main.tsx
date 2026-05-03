import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import AppRoutes from './routes/AppRoutes.tsx'
import { DataTableProvider } from './components/common/datatable/DatatableProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DataTableProvider>
        <AppRoutes />
      </DataTableProvider>
    </AuthProvider>
  </StrictMode>,
)
