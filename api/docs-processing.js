export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const response = await fetch(
            "https://developer.orkescloud.com/api/workflow/oqwe289306da-2331-11f0-bbb9-76512c6ab0ea",
            {
                headers: {
                    accept: "*/*",
                    "X-Authorization":
                        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtqbVlNWThEV2VOU1lKZmZSSjFXNSJ9.eyJnaXZlbl9uYW1lIjoiQW5hw69zIiwiZmFtaWx5X25hbWUiOiJLaWxsaWFuIiwibmlja25hbWUiOiJhbmFpc2tpbGxpYW4iLCJuYW1lIjoiQW5hw69zIEtpbGxpYW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSzZ3UU9GcS0xbVZEUXVXcHVLWVFXT1JoUktVTWtmQ3JSU0R3ekJBU2pzdmhZVGl3PXM5Ni1jIiwidXBkYXRlZF9hdCI6IjIwMjUtMDQtMjdUMDE6MzQ6MzQuMDM1WiIsImVtYWlsIjoiYW5haXNraWxsaWFuQGNvbGxlZ2UuaGFydmFyZC5lZHUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hdXRoLm9ya2VzLmlvLyIsImF1ZCI6Ik15SEpZdVRzcU5MOERhTElHd291NmZTYXh6RjNURnJXIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTU5MjAxNjA3ODI1NTY3MzMxOTUiLCJpYXQiOjE3NDU3MTc2NzUsImV4cCI6MTc0NTc1MzY3NSwic2lkIjoiN1dyYlBLUUdSMFJLbmdtQ0hDSktPNTFwT1A0VWRFeUoiLCJub25jZSI6Ik9FVlZjbGxCUlhOck16UkphekJ4VFdaS1N6STFOM2hwZEVGSmNEaGtMbGwrWjFCaFRURmhSVGxSTXc9PSJ9.narVZn0GR3fn4RglevJCX-UdILqRmV1g-thTSn8O8ItsN5lYqoKyxR0g0_RWvND6YdvZA7gE6p2_sYYEyfyeSFOQaM8m3JdnOJelVtS-LI0QvVSYfgngKVOQqPAIEyoLqIWgWsk6i2Pf8jKo_Yn2SMvAIC8FAS5hkXjMOrQTKv4i-N-6_-yP3G78TCvkDCrmoHOPJnXhNFFAtkiiTb7eqUpR36fvdYgD69YBtDiHzBIbfPBnYeOSz9mfyfHNVGOXQjr6uvHLb53OQSVZ3vdpQfAO8Q_vrN50qiIzSh2EKPhl1q9oI6cRbQhuQ2KFM_kjPS90HcEIw8VZKIXyjRJyWA",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `API request failed with status ${response.status}`
            );
        }

        const data = await response.json();
        console.log("Chart data:", data.tasks[1].outputData);
        res.status(200).json({ data: data.output?.graphs || [] });
    } catch (err) {
        console.error("Error fetching chart data:", err);
        res.status(500).json({
            error: "Failed to load chart data. Please check your API key.",
        });
    }
}
