import axios from "axios";
import FormData from "form-data";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { audioUrl } = req.body;
    if (!audioUrl) {
        return res.status(400).json({ error: "Audio URL is required" });
    }

    try {
        console.log("Received audio URL:", audioUrl);
        // Validate the audio URL
        const urlPattern = /^(https?:\/\/[^\s]+)$/;
        if (!urlPattern.test(audioUrl)) {
            return res.status(400).json({ error: "Invalid audio URL" });
        }
        // Fetch the audio file
        const audioResponse = await axios.get(audioUrl, {
            responseType: "arraybuffer",
        });

        const audioBuffer = Buffer.from(audioResponse.data);

        console.log(`Processing audio file from URL: ${audioUrl}`);
        const formData = new FormData();
        formData.append("file", audioBuffer, "audio.mp3"); // Replace with appropriate file name if needed
        formData.append("model", "whisper-1"); // Replace with the appropriate model name

        const whisperResponse = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        console.log("Whisper response:", whisperResponse.data);

        const transcription = whisperResponse.data.text;

        console.log("Transcription:", transcription);

        res.status(200).json({ transcription });
    } catch (error) {
        console.error("Error processing audio file:", error);
        console.error("Error details:", error.response?.data || error.message);
        res.status(500).json({
            error: "Failed to process audio file",
            details: error.message,
        });
    }
}
