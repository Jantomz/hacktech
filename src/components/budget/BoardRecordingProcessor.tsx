import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const BoardRecordingProcessor = () => {
    const [url, setUrl] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsProcessing(true);
        try {
            // Here we would integrate with Supabase Edge Functions to process the URL
            console.log("Processing URL:", url);
            toast({
                title: "Processing started",
                description:
                    "Your recordings are being processed. This may take a few minutes.",
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
                <CardTitle>Process Board Recordings</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <Input
                            type="url"
                            placeholder="Enter URL containing MP3 files"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isProcessing}
                        />
                        <Button type="submit" disabled={isProcessing || !url}>
                            Process Recordings
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
