
import React, { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";

interface AppLayoutProps {
  transparentHeader?: boolean;
  onNavigate?: (path: string) => void;
}

export function AppLayout({ 
  children,
  transparentHeader = false,
  onNavigate
}: PropsWithChildren<AppLayoutProps>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent={transparentHeader} onNavigate={onNavigate} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="bg-budget-secondary text-white py-6 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-budget-primary rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <h2 className="text-xl font-bold">Budget Translator</h2>
              </div>
              <p className="text-sm text-gray-300 mt-2">Making public finance transparent</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>Budget Visualization</li>
                  <li>Time Analysis</li>
                  <li>Geographic Mapping</li>
                  <li>Video Integration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Resources</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>Documentation</li>
                  <li>Help Center</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Budget Translator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
