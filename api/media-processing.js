import axios from "axios";
import FormData from "form-data";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { folderUrl } = req.body;
    if (!folderUrl) {
        return res.status(400).json({ error: "Folder URL is required" });
    }

    let fullTranscription = "";

    try {
        // Fetch the list of files in the folder
        const fileListResponse = await axios.get(folderUrl, {
            headers: {
                Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
            },
        });

        const audioFiles = fileListResponse.data
            .filter((file) => file.name.endsWith(".mp3"))
            .map((file) => file.name);

        for (const fileName of audioFiles) {
            const audioUrl = `https://yslcdzqtwgavdlxzapbp.supabase.co/storage/v1/object/public/pasadena-board-recordings/Pasadena/${fileName}`;

            try {
                // Fetch the audio file
                const audioResponse = await axios.get(audioUrl, {
                    responseType: "arraybuffer",
                });

                const audioBuffer = Buffer.from(audioResponse.data);

                console.log(`Processing file: ${fileName}`);
                const formData = new FormData();
                formData.append("file", audioBuffer, fileName);
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

                console.log(
                    `Whisper response for ${fileName}:`,
                    whisperResponse.data
                );

                const transcription = whisperResponse.data.text;

                console.log(`Transcription for ${fileName}:`, transcription);

                fullTranscription += transcription + " ";
            } catch (error) {
                console.error(`Error processing file ${fileName}:`, error);
                console.error(
                    "Error details:",
                    error.response?.data || error.message
                );
            }
        }

        res.status(200).json({ transcription: fullTranscription.trim() });
    } catch (error) {
        console.error("Error fetching file list:", error);
        res.status(500).json({
            error: "Failed to fetch file list",
            details: error.message,
        });
    }
}
