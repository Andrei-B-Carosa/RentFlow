import React, { createContext, useContext, useState } from 'react';

interface TableState<T> {
  data: T[];
  loading: boolean;
  refreshKey: number; // force re-render when refresh
}

interface DataTableContextProps {
  tables: Record<string, TableState<any>>;
  setTableData: <T>(tableId: string, data: T[]) => void;
  setTableLoading: (tableId: string, loading: boolean) => void;
  refreshTable: (tableId: string, resetPage?: () => void) => void;
}

const DataTableContext = createContext<DataTableContextProps | undefined>(undefined);

export const useDataTable = () => {
  const context = useContext(DataTableContext);
  if (!context) throw new Error('useDataTable must be used within DataTableProvider');
  return context;
};

export const DataTableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Record<string, TableState<any>>>({});

  const setTableData = <T,>(tableId: string, data: T[]) => {
    setTables(prev => ({
      ...prev,
      [tableId]: { ...(prev[tableId] || { data: [], loading: false, refreshKey: 0 }), data }
    }));
  };

  const setTableLoading = (tableId: string, loading: boolean) => {
    setTables(prev => ({
      ...prev,
      [tableId]: { ...(prev[tableId] || { data: [], loading: false, refreshKey: 0 }), loading }
    }));
  };

const refreshTable = (tableId: string, resetPage?: () => void) => {
    setTables(prev => ({
        ...prev,
        [tableId]: {
        ...(prev[tableId] || { data: [], loading: false, refreshKey: 0 }),
        refreshKey: (prev[tableId]?.refreshKey || 0) + 1,
        },
    }));

    if (resetPage) resetPage(); // call callback to reset page
};

  return (
    <DataTableContext.Provider value={{ tables, setTableData, setTableLoading, refreshTable }}>
      {children}
    </DataTableContext.Provider>
  );
};
