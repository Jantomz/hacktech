import React, { useState } from "react";
import { AppLayoutWrapper } from "@/components/layout/AppLayoutWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Upload = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [description, setDescription] = useState("");
    const [urls, setUrls] = useState<string[]>([]);
    const [currentUrl, setCurrentUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    const addUrl = () => {
        if (currentUrl.trim() === "") {
            toast({
                title: "Invalid URL",
                description: "Please enter a valid URL.",
                variant: "destructive",
            });
            return;
        }
        setUrls((prev) => [...prev, currentUrl.trim()]);
        setCurrentUrl("");
    };

    const removeUrl = (index: number) => {
        setUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (urls.length === 0) {
            toast({
                title: "No URLs provided",
                description: "Please add at least one URL.",
                variant: "destructive",
            });
            return;
        }

        setUploading(true);

        for (const url of urls) {
            try {
                const response = await fetch("/api/docs-processing", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ url }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to process URL: ${url}`);
                }

                const data = await response.json();
                console.log(`Processed ${url}:`, data);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Processing Failed",
                    description: `Failed to process URL: ${url}. Please try again.`,
                    variant: "destructive",
                });
                setUploading(false);
                return;
            }
        }

        setTimeout(() => {
            setUploading(false);
            toast({
                title: "Processing Successful",
                description:
                    "Your URLs have been processed. You can now view your dashboard.",
            });
            navigate("/dashboard");
        }, 2000);
    };

    return (
        <AppLayoutWrapper>
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Upload Budget Documents
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">
                        Provide URLs to your budget documents and meeting videos
                        to create a transparent dashboard.
                    </p>

                    <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="upload">Add URLs</TabsTrigger>
                            <TabsTrigger value="sample">
                                Use Sample Data
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload">
                            <Card>
                                <CardContent className="pt-6">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="website">
                                                Council Website URL (optional)
                                            </Label>
                                            <Input
                                                id="website"
                                                placeholder="https://www.citycouncil.gov"
                                                value={websiteUrl}
                                                onChange={(e) =>
                                                    setWebsiteUrl(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Link to your city council
                                                website where meeting videos are
                                                hosted
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">
                                                Project Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Describe this budget project..."
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value
                                                    )
                                                }
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="urls">
                                                Budget Document URLs
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="urls"
                                                    placeholder="https://example.com/document.pdf"
                                                    value={currentUrl}
                                                    onChange={(e) =>
                                                        setCurrentUrl(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addUrl}
                                                >
                                                    Add URL
                                                </Button>
                                            </div>
                                            {urls.length > 0 && (
                                                <ul className="space-y-2 mt-4">
                                                    {urls.map((url, index) => (
                                                        <li
                                                            key={index}
                                                            className="bg-muted/40 rounded-md px-3 py-2 flex justify-between items-center"
                                                        >
                                                            <span className="truncate max-w-[80%]">
                                                                {url}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeUrl(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                Remove
                                                            </Button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                className="w-full bg-budget-primary hover:bg-budget-primary/90"
                                                disabled={uploading}
                                            >
                                                {uploading
                                                    ? "Processing..."
                                                    : "Generate Dashboard"}
                                                {!uploading && (
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="sample">
                            {/* Sample Data Content */}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayoutWrapper>
    );
};

export default Upload;
