export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body;

    const text = body.text;

    const tokenResponse = await fetch(
        "https://developer.orkescloud.com/api/token",
        {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                keyId: process.env.ATHARVA_KEY_ID || "",
                keySecret: process.env.ATHARVA_KEY_SECRET || "",
            }),
        }
    );

    if (!tokenResponse.ok) {
        throw new Error(
            `Token request failed with status ${tokenResponse.status}`
        );
    }

    const tokenData = await tokenResponse.json();
    console.log("Token response:", tokenData);

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
                        "X-Authorization": tokenData.token || "",
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
