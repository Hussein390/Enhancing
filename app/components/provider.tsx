import React, { createContext, ReactNode, useContext, useState, Dispatch, SetStateAction } from "react";

// Define the type for days
type Days = {
  id: string;
  postion: number;
  isTrue: boolean;
  monthId: string | null;
};

// Define the context value type
type IsOpenContextType = {
  days: Days[];
  setDays: Dispatch<SetStateAction<Days[]>>;
};

// Create the context with a proper default value
const DataContext = createContext<IsOpenContextType>({
  days: [], // Default value
  setDays: () => { }, // Default no-op function
});

// Create a provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [days, setDays] = useState<Days[]>([]);

  return (
    <DataContext.Provider value={{ days, setDays }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const DataYears = () => {
  return useContext(DataContext);
};
