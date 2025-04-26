
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
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate uploading
    setUploading(true);
    
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Upload Successful",
        description: "Your budget documents have been processed. You can now view your dashboard.",
      });
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <AppLayoutWrapper>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Upload Budget Documents</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Upload your budget files and link to meeting videos to create a transparent dashboard.
          </p>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upload">Upload Documents</TabsTrigger>
              <TabsTrigger value="sample">Use Sample Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="website">Council Website URL (optional)</Label>
                      <Input
                        id="website"
                        placeholder="https://www.citycouncil.gov"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Link to your city council website where meeting videos are hosted
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe this budget project..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="files">Budget Documents</Label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                        <Input
                          id="files"
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Label 
                          htmlFor="files" 
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <div className="w-12 h-12 rounded-full bg-budget-primary/10 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-budget-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-lg font-medium mb-1">Drag files here or click to upload</p>
                          <p className="text-sm text-muted-foreground">
                            Support for PDF, Excel, CSV (max 50MB per file)
                          </p>
                        </Label>
                      </div>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Uploaded Files ({files.length})</h3>
                        <ul className="space-y-2">
                          {files.map((file, index) => (
                            <li 
                              key={index} 
                              className="bg-muted/40 rounded-md px-3 py-2 flex justify-between items-center"
                            >
                              <span className="truncate max-w-[80%]">{file.name}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFile(index)}
                              >
                                Remove
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-budget-primary hover:bg-budget-primary/90" 
                        disabled={uploading}
                      >
                        {uploading ? "Processing..." : "Generate Dashboard"} 
                        {!uploading && <ArrowRight className="ml-2 h-5 w-5" />}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sample">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Sample Budget Data</h3>
                      <p className="text-muted-foreground">
                        Use our pre-loaded sample data to explore the dashboard features without uploading your own files.
                      </p>
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                      <div>
                        <h4 className="font-medium">Sample City Budget 2025</h4>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive municipal budget with department breakdowns, geographic allocations, and 5-year historical data.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-budget-primary/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-budget-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Budget Documents</p>
                          <p className="text-sm text-muted-foreground">5 files included</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-budget-primary/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-budget-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v10.764a1 1 0 01-1.447.894L15 18M5 18l-4.553-2.276A1 1 0 010 14.382V3.618a1 1 0 011.447-.894L6 5m0 13V5m0 0L9 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Council Meeting Videos</p>
                          <p className="text-sm text-muted-foreground">3 videos with timestamps</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-budget-primary hover:bg-budget-primary/90" 
                      onClick={() => navigate("/dashboard")}
                    >
                      View Sample Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayoutWrapper>
  );
};

export default Upload;
