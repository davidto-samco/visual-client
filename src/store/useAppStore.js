import { useContext } from "react";
import { AppStoreContext } from "./AppStore";

export function useAppStore() {
  return useContext(AppStoreContext);
}
