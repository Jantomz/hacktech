export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { text } = req.body;

    try {
        const response = await fetch(
            "https://developer.orkescloud.com/api/workflow/generate_embeddings_task?priority=0",
            {
                method: "POST",
                headers: {
                    accept: "text/plain",
                    "X-Authorization": process.env.ATHARVA_ORKES || "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            }
        );

        const data = await response.json();

        console.log("Response from Orkes API:", data);
        return res.status(response.status).json(data);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
