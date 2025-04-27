import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const BoardRecordingProcessor = () => {
    const [url, setUrl] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [files, setFiles] = useState<
        {
            name: string;
            status: "pending" | "processing" | "completed" | "failed";
            progress: number; // Add progress to track pseudo-progress
        }[]
    >([]);
    const { toast } = useToast();

    const updateProgress = (fileName: string, targetProgress: number) => {
        let interval = setInterval(() => {
            let speed = Math.random() * 6000 + 50; // Random speed between 50ms and 250ms
            clearInterval(interval); // Clear the previous interval
            const newInterval = setInterval(() => {
                setFiles((prevFiles) =>
                    prevFiles.map((file) => {
                        if (
                            file.name === fileName &&
                            file.progress < targetProgress
                        ) {
                            const increment = Math.floor(
                                Math.random() * (file.progress < 80 ? 3 : 7) + 1
                            ); // Random increment, smaller for progress < 80
                            if (file.status === "completed") {
                                speed = 10; // Make the progress go up super fast for completed files
                                return {
                                    ...file,
                                    progress: 100, // Automatically set progress to 100 for completed files
                                };
                            }
                            return {
                                ...file,
                                progress: Math.min(
                                    file.progress + increment,
                                    targetProgress
                                ),
                            };
                        }
                        return file;
                    })
                );
            }, speed);
            interval = newInterval;
        }, 100);

        if (targetProgress === 100) {
            setTimeout(() => clearInterval(interval), 2000); // Clear interval after reaching 100%
        }
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsProcessing(true);
        setFiles([]);
        try {
            toast({
                title: "Processing started",
                description:
                    "Your recordings are being processed. This may take a few minutes.",
            });

            const audioFilesResponse = await fetch("/api/access-recordings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ folderUrl: url }),
            });

            if (!audioFilesResponse.ok) {
                throw new Error("Failed to fetch audio files");
            }
            const audioFilesData: { files: { name: string }[] } =
                await audioFilesResponse.json();
            if (
                !Array.isArray(audioFilesData.files) ||
                audioFilesData.files.length === 0
            ) {
                throw new Error("No audio files found");
            }

            const initialFiles = audioFilesData.files.map((file) => ({
                name: file.name,
                status: "pending" as const, // Use const assertion for literal type
                progress: 0, // Initialize progress to 0
            }));
            setFiles(initialFiles);

            for (const audioFile of audioFilesData.files) {
                setFiles((prevFiles) =>
                    prevFiles.map((file) =>
                        file.name === audioFile.name
                            ? { ...file, status: "processing" }
                            : file
                    )
                );

                updateProgress(audioFile.name, 100); // Start pseudo-progress to a random value between 70 and 80

                try {
                    const response = await fetch("/api/media-processing", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            audioUrl: `${url}/${audioFile.name}`,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(
                            `Failed to process the file: ${audioFile.name}`
                        );
                    }
                    const data = await response.json();
                    console.log(
                        `Processing result for ${audioFile.name}:`,
                        data
                    );

                    setFiles((prevFiles) =>
                        prevFiles.map((file) =>
                            file.name === audioFile.name
                                ? { ...file, status: "completed" }
                                : file
                        )
                    );
                    updateProgress(audioFile.name, 100); // Complete progress to 100%
                } catch (error) {
                    console.error(
                        `Error processing file ${audioFile.name}:`,
                        error
                    );
                    setFiles((prevFiles) =>
                        prevFiles.map((file) =>
                            file.name === audioFile.name
                                ? { ...file, status: "failed" }
                                : file
                        )
                    );
                }
            }

            toast({
                title: "Processing completed",
                description: "All recordings have been processed successfully.",
            });
            setUrl("");
        } catch (error) {
            console.error("Error processing recordings:", error);
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
                <div className="mt-4 space-y-2">
                    {files.map((file) => (
                        <div
                            key={file.name}
                            className="flex items-center space-x-2"
                        >
                            <span>{file.name}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded">
                                <div
                                    className={`h-2 ${
                                        file.status === "failed"
                                            ? "bg-red-500"
                                            : "bg-blue-500"
                                    } rounded`}
                                    style={{ width: `${file.progress}%` }}
                                ></div>
                            </div>
                            <span>
                                {file.status === "pending" && "⏳ Pending"}
                                {file.status === "processing" &&
                                    "🔄 Processing"}
                                {file.status === "completed" && "✅ Completed"}
                                {file.status === "failed" && "❌ Failed"}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
