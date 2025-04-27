export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ error: "Address is required" });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
    )}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
            return res.status(200).json({
                coordinates: data.results[0].geometry.location,
            });
        } else {
            return res.status(400).json({
                error: "Error fetching coordinates",
                status: data.status,
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error",
            details: error.message,
        });
    }
}
