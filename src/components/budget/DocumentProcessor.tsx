import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export const DocumentProcessor = () => {
    const [urls, setUrls] = useState<string[]>([""]);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const { user } = useAuth();

    const handleUrlChange = (index: number, value: string) => {
        const updatedUrls = [...urls];
        updatedUrls[index] = value;
        setUrls(updatedUrls);
    };

    const handleAddUrl = () => {
        setUrls([...urls, ""]);
    };

    const handleRemoveUrl = (index: number) => {
        const updatedUrls = urls.filter((_, i) => i !== index);
        setUrls(updatedUrls);
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (urls.every((url) => !url)) return;

        setIsProcessing(true);
        try {
            for (const url of urls) {
                if (!url) continue;

                console.log("Processing URL:", url);

                const response = await fetch("/api/docs-processing", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ documentUrl: url, uid: user.id }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to process the document: ${url}`);
                }

                const data = await response.json();

                console.log("Processing result:", data);
                toast({
                    title: "Processing started",
                    description: `Your document (${url}) is being processed. This may take a few minutes.`,
                });
            }
            setUrls([""]);
        } catch (error) {
            toast({
                title: "Processing failed",
                description: "Please check the URLs and try again",
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
                        {urls.map((url, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <Input
                                    type="text"
                                    placeholder={`Enter document URL ${
                                        index + 1
                                    }`}
                                    value={url}
                                    onChange={(e) =>
                                        handleUrlChange(index, e.target.value)
                                    }
                                    disabled={isProcessing}
                                />
                                {urls.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => handleRemoveUrl(index)}
                                        disabled={isProcessing}
                                    >
                                        -
                                    </Button>
                                )}
                            </div>
                        ))}
                        <div className="text-sm text-muted-foreground">
                            You can add multiple URLs. Make sure they are
                            accessible and in a supported format (pdf).
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                type="button"
                                className="cursor-pointer"
                                onClick={handleAddUrl}
                                disabled={isProcessing}
                            >
                                +
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    isProcessing || urls.every((url) => !url)
                                }
                            >
                                Process URLs
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
