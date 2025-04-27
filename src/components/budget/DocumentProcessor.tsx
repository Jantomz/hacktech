import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export const DocumentProcessor = () => {
    const [url, setUrl] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const { user } = useAuth(); // Assuming you have a way to get the current user

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsProcessing(true);
        try {
            // Here we would integrate with Supabase Edge Functions to process the URL
            console.log("Processing URL:", url);

            const response = await fetch("/api/docs-processing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ documentUrl: url, uid: user.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to process the document");
            }

            const data = await response.json();

            console.log("Processing result:", data);
            toast({
                title: "Processing started",
                description:
                    "Your document is being processed. This may take a few minutes.",
            });
            setUrl("");
        } catch (error) {
            toast({
                title: "Processing failed",
                description: "Please check the URL and try again",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Process Budget Documents</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Enter document URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isProcessing}
                        />
                        <Button type="submit" disabled={isProcessing || !url}>
                            Process URL
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
