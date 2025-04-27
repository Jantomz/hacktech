import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const DocumentProcessor = () => {
    const [url, setUrl] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (uploadedFiles.length === 0) return;

                        setIsProcessing(true);
                        try {
                            // Here we would integrate with Supabase Edge Functions to process the files
                            console.log("Processing files:", uploadedFiles);
                            toast({
                                title: "Processing started",
                                description:
                                    "Your documents are being processed. This may take a few minutes.",
                            });
                            setUploadedFiles([]);
                        } catch (error) {
                            toast({
                                title: "Processing failed",
                                description: "Please try again",
                                variant: "destructive",
                            });
                        } finally {
                            setIsProcessing(false);
                        }
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                type="file"
                                multiple
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files) {
                                        setUploadedFiles((prev) => [
                                            ...prev,
                                            ...Array.from(files).map(
                                                (file) => file.name
                                            ),
                                        ]);
                                    }
                                }}
                                disabled={isProcessing}
                            />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">
                                Uploaded Files:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {uploadedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-1 bg-gray-200 text-sm rounded-md"
                                    >
                                        {file}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={
                                isProcessing || uploadedFiles.length === 0
                            }
                        >
                            Process All
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
