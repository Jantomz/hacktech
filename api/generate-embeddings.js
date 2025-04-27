export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body;

    const text = body.text;

    function chunkText(text, chunkSize = 500) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const chunks = [];
        let currentChunk = "";

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length <= chunkSize) {
                currentChunk += sentence;
            } else {
                if (currentChunk) chunks.push(currentChunk);
                currentChunk = sentence;
            }
        }

        if (currentChunk) chunks.push(currentChunk);
        return chunks;
    }

    const chunks = chunkText(text);

    for (const chunk of chunks) {
        console.log("Chunk:", chunk);
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        try {
            const response = await fetch(
                "https://developer.orkescloud.com/api/workflow/generate_embeddings_task_2?priority=0",
                {
                    method: "POST",
                    headers: {
                        accept: "text/plain",
                        "X-Authorization": process.env.ATHARVA_ORKES || "",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: id,
                        text: chunk,
                    }),
                }
            );

            const data = await response.text();
            console.log("Response from Orkes API for chunk:", data);
        } catch (error) {
            console.error("Error processing chunk:", error);
        }
    }
}
