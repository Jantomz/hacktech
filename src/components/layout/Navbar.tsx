import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({
    transparent = false,
    onNavigate,
}: {
    transparent?: boolean;
    onNavigate?: (path: string) => void;
}) {
    const { user, signOut } = useAuth();

    const handleNavigation = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        } else {
            // Fallback to direct navigation if no handler is provided
            window.location.href = path;
        }
    };

    const handleSignOut = async () => {
        await signOut();
        handleNavigation("/");
    };

    return (
        <header
            className={cn(
                "w-full py-4 px-6 flex items-center justify-between z-10",
                transparent
                    ? "absolute top-0 left-0 right-0"
                    : "bg-background border-b"
            )}
        >
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-budget-primary rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xl">B</span>
                </div>
                <h1
                    className={cn(
                        "text-xl font-bold",
                        transparent && "text-white"
                    )}
                >
                    Budget Translator
                </h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
                <Button
                    variant="link"
                    className={cn(transparent && "text-white")}
                    onClick={() => handleNavigation("/")}
                >
                    Home
                </Button>
                {user ? (
                    <>
                        <Button
                            variant="link"
                            className={cn(transparent && "text-white")}
                            onClick={() => handleNavigation("/upload")}
                        >
                            Upload
                        </Button>
                        <Button
                            variant="link"
                            className={cn(transparent && "text-white")}
                            onClick={() => handleNavigation("/dashboard")}
                        >
                            Dashboard
                        </Button>
                    </>
                ) : null}
            </nav>

            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-9 w-9 rounded-full"
                            aria-label="User menu"
                        >
                            <div className="h-9 w-9 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleNavigation("/dashboard")}
                        >
                            Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleNavigation("/upload")}
                        >
                            Upload Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer text-red-500"
                            onClick={handleSignOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        className={cn(
                            transparent && "text-white hover:bg-white/10"
                        )}
                        onClick={() => handleNavigation("/signin")}
                    >
                        Sign In
                    </Button>
                    <Button
                        onClick={() => handleNavigation("/signup")}
                        className={cn(
                            "gap-2",
                            transparent
                                ? "bg-white text-budget-primary hover:bg-white/90"
                                : ""
                        )}
                    >
                        Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </header>
    );
}
