import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signIn: (
        email: string,
        password: string
    ) => Promise<{
        error: Error | null;
        data: Session | null;
    }>;
    signUp: (
        email: string,
        password: string
    ) => Promise<{
        error: Error | null;
        data: User | null;
    }>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false);
        };

        getSession();

        // Subscribe to auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setIsLoading(false);
        return {
            error,
            data: data?.session || null,
        };
    };

    const signUp = async (email: string, password: string) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: "government",
                    createdAt: new Date().toISOString(),
                },
            },
        });
        setIsLoading(false);
        return {
            error,
            data: data?.user || null,
        };
    };

    const signOut = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{ user, session, isLoading, signIn, signUp, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
