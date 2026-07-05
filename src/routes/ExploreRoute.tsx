import { Outlet } from "react-router-dom";
import { ExploreProvider } from "@/contexts/ExploreContext";

export function ExploreRoute() {
  return (
    <ExploreProvider>
      <Outlet />
    </ExploreProvider>
  );
}
