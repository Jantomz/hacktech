export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { document_url } = req.body;

    try {
        const response = await fetch(
            "https://developer.orkescloud.com/api/workflow/budget_json_extractor?priority=0",
            {
                method: "POST",
                headers: {
                    accept: "text/plain",
                    "X-Authorization": process.env.ANAIS_ORKES || "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    document_url: document_url,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(
                `API request failed with status ${response.status}`
            );
        }
        const data = await response.text();

        console.log("Response from Orkes API:", data);

        let parsedData;

        do {
            console.log("Waiting for 10 seconds...");

            await new Promise((resolve) => setTimeout(resolve, 10000));

            const workflowResponse = await fetch(
                `https://developer.orkescloud.com/api/workflow/${data}`,
                {
                    method: "GET",
                    headers: {
                        accept: "*/*",
                        "X-Authorization": process.env.ANAIS_ORKES || "",
                    },
                }
            );

            if (!workflowResponse.ok) {
                throw new Error(
                    `Workflow fetch failed with status ${workflowResponse.status}`
                );
            }

            parsedData = await workflowResponse.json();
            console.log("Workflow details:", parsedData.tasks[1].outputData);
        } while (parsedData.tasks[1].outputData.budget_entries === undefined);

        res.status(200).json({ data: parsedData.tasks[1].outputData || [] });

        // if (!response.ok) {
        //     throw new Error(
        //         `API request failed with status ${response.status}`
        //     );
        // }

        // const data = await response.json();
        // console.log("Chart data:", data.tasks[1].outputData);
        // res.status(200).json({ data: data.tasks[1].outputData || [] });
    } catch (err) {
        console.error("Error fetching chart data:", err);
        res.status(500).json({
            error: "Failed to load chart data. Please check your API key.",
        });
    }
}
