import { createContext, useContext } from "react";

interface User {
  email: string;
  fullName?: string;
  totalFiles?: number;
  maxFiles?: number;
}

export const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);
