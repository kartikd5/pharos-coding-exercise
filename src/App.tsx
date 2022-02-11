import React, { createContext, useState } from "react";
import { Dashboard } from './Containers';
import './App.css';

interface ContextFilters {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
}

export interface Filters {
  bizCapability?: string;
  id?: string;
  startingRange?: number;
}

export const FilterContext = createContext<ContextFilters>({} as ContextFilters);

function App() {

  const [filters, setFilters] = useState<Filters>({});

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <Dashboard />
    </FilterContext.Provider>
  );
}

export default App;