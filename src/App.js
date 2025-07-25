import React from "react";
import UserRoleManagement from "./Pages/Admin/UserRoleManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <UserRoleManagement />
      </div>
    </QueryClientProvider>
  );
}

export default App;
