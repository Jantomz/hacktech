import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { tmpdir } from "os";
import { join } from "path";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegPath);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: "Video URL is required" });
    }

    try {
        new URL(videoUrl); // just to validate format
    } catch {
        return res.status(400).json({ error: "Invalid video URL format" });
    }

    try {
        const outputPath = join(tmpdir(), `audio-${Date.now()}.mp3`);

        ffmpeg(videoUrl)
            .output(outputPath)
            .noVideo()
            .on("end", () => {
                const audioStream = fs.createReadStream(outputPath);
                res.setHeader("Content-Type", "audio/mpeg");
                audioStream.pipe(res);

                audioStream.on("close", () => {
                    fs.unlinkSync(outputPath);
                });
            })
            .on("error", (err) => {
                console.error(err);
                res.status(500).json({ error: "Failed to process video" });
            })
            .run();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
