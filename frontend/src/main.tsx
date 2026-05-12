import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import AppRoutes from './routes/AppRoutes.tsx'
import { DataTableProvider } from './components/common/datatable/DatatableProvider.tsx'
import { ModalProvider } from './components/common/modal/ModalProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DataTableProvider>
        <ModalProvider>
          <AppRoutes />
        </ModalProvider>
      </DataTableProvider>
    </AuthProvider>
  </StrictMode>,
)
