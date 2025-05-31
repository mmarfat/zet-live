import { createContext, useContext } from "react";

export const FileDataContext = createContext();
export const useFileData = () => {
  const fileData = useContext(FileDataContext);
  return { fileData };
};