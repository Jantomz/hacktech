import React, { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";

interface AppLayoutProps {
    transparentHeader?: boolean;
    onNavigate?: (path: string) => void;
}

export function AppLayout({
    children,
    transparentHeader = false,
    onNavigate,
}: PropsWithChildren<AppLayoutProps>) {
    const handleNavigation = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        } else {
            // Fallback to direct navigation if no handler is provided
            window.location.href = path;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar transparent={transparentHeader} onNavigate={onNavigate} />
            <main className="flex-1 flex flex-col">{children}</main>
            <footer className="bg-budget-secondary text-white py-8 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* Logo and tagline - takes 4 columns on desktop */}
                        <div className="md:col-span-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 flex items-center justify-center cursor-pointer"
                                    onClick={() => handleNavigation("/")}
                                    aria-label="Go to home page"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            handleNavigation("/");
                                        }
                                    }}
                                >
                                    <img
                                        src="/favicon.ico"
                                        alt="Atlas logo"
                                        className="h-10 w-10"
                                    />
                                </div>
                                <h2 className="text-xl font-bold">Atlas</h2>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">
                                Your Map to Financial Transparency
                            </p>
                        </div>

                        {/* Features and Resources - takes 8 columns with nested grid */}
                        <div className="md:col-span-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">
                                        Features
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-4">
                                        <ul className="space-y-2 text-sm text-gray-300">
                                            <li>Budget Visualization</li>
                                            <li>Geographic Mapping</li>
                                        </ul>
                                        <ul className="space-y-2 text-sm text-gray-300">
                                            <li>Time Analysis</li>
                                            <li>Video Integration</li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">
                                        Resources
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-4">
                                        <ul className="space-y-2 text-sm text-gray-300">
                                            <a
                                                href="https://github.com/Jantomz/hacktech"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <li>Documentation</li>
                                            </a>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} Atlas. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
