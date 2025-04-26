
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const DocumentProcessor = () => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsProcessing(true);
    try {
      // Here we would integrate with Supabase Edge Functions to process the URL
      console.log('Processing URL:', url);
      toast({
        title: "Processing started",
        description: "Your document is being processed. This may take a few minutes.",
      });
      setUrl('');
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
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter document or video URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <Button type="submit" disabled={isProcessing}>
              Process
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
