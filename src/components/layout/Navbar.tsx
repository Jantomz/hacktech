
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar({ 
  transparent = false,
  onNavigate
}: { 
  transparent?: boolean,
  onNavigate?: (path: string) => void
}) {
  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // Fallback to direct navigation if no handler is provided
      window.location.href = path;
    }
  };
  
  return (
    <header 
      className={cn(
        "w-full py-4 px-6 flex items-center justify-between z-10",
        transparent ? "absolute top-0 left-0 right-0" : "bg-background border-b"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-budget-primary rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-xl">B</span>
        </div>
        <h1 className={cn(
          "text-xl font-bold",
          transparent && "text-white"
        )}>
          Budget Translator
        </h1>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <Button 
          variant="link" 
          className={cn(transparent && "text-white")} 
          onClick={() => handleNavigation('/')}
        >
          Home
        </Button>
        <Button 
          variant="link" 
          className={cn(transparent && "text-white")}
          onClick={() => handleNavigation('/upload')}
        >
          Upload
        </Button>
        <Button 
          variant="link" 
          className={cn(transparent && "text-white")}
          onClick={() => handleNavigation('/dashboard')}
        >
          Dashboard
        </Button>
      </nav>
      
      <Button 
        onClick={() => handleNavigation('/upload')}
        className={cn(
          "gap-2",
          transparent ? "bg-white text-budget-primary hover:bg-white/90" : ""
        )}
      >
        Get Started <ArrowRight className="h-4 w-4" />
      </Button>
    </header>
  );
}
