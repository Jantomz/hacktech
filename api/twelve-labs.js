const fetch = require("node-fetch");
const FormData = require("form-data");

export default async function handler(req, res) {
    const { index_id, video_url } = req.body;

    if (!index_id || !video_url) {
        return res
            .status(400)
            .json({ error: "index_id and video_url are required" });
    }

    const formData = new FormData();
    formData.append("index_id", index_id);
    formData.append("video_url", video_url);

    try {
        const response = await fetch("https://api.twelvelabs.io/v1.3/tasks", {
            method: "POST",
            headers: {
                "x-api-key": "tlk_0AYZT1A2KXWGGW2T8F8TM3SSF9BW",
                ...formData.getHeaders(),
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
    res.status(200).json({ message: "Hello from Vite serverless!" });
}
