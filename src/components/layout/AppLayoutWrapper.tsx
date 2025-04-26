
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "./AppLayout";

interface AppLayoutWrapperProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
}

export function AppLayoutWrapper({ 
  children, 
  transparentHeader = false 
}: AppLayoutWrapperProps) {
  const navigate = useNavigate();
  
  return (
    <AppLayout 
      transparentHeader={transparentHeader}
      onNavigate={(path) => navigate(path)}
    >
      {children}
    </AppLayout>
  );
}
