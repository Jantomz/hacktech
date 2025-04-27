export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body;
    const text = body.text;

    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Invalid input text" });
    }

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

    try {
        // Call the sentiment analysis workflow
        const response = await fetch(
            "https://developer.orkescloud.com/api/workflow/sentiment_analysis_workflow?priority=0",
            {
                method: "POST",
                headers: {
                    accept: "text/plain",
                    "X-Authorization": tokenData.token || "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: text,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const workflowId = await response.text();
        console.log("Response from Orkes API:", workflowId);

        // Poll for workflow completion and result
        let parsedData;
        let attempts = 0;
        const MAX_ATTEMPTS = 10;

        do {
            console.log("Waiting for workflow completion...");
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const workflowResponse = await fetch(
                `https://developer.orkescloud.com/api/workflow/${workflowId}`,
                {
                    method: "GET",
                    headers: {
                        accept: "*/*",
                        "X-Authorization": tokenData.token || "",
                    },
                }
            );

            if (!workflowResponse.ok) {
                throw new Error(
                    `Workflow fetch failed with status ${workflowResponse.status}`
                );
            }

            parsedData = await workflowResponse.json();
            attempts++;

            // Check if workflow is completed
            if (parsedData.status === "COMPLETED" || parsedData.status === "TERMINATED") {
                break;
            }

            if (attempts >= MAX_ATTEMPTS) {
                throw new Error("Workflow processing timeout");
            }
        } while (true);

        // Extract result from workflow output
        let result;
        
        if (parsedData.status === "TERMINATED") {
            // Handle nonsense case
            result = "NO_MATCH";
        } else if (parsedData.output && parsedData.output.result) {
            // Handle valid text case with sentiment result
            result = parsedData.output.result;
        } else if (parsedData.tasks && parsedData.tasks.length > 0) {
            // Try to extract from task output if not in main output
            const extractTask = parsedData.tasks.find(
                task => task.taskReferenceName === "extract_classification"
            );
            if (extractTask && extractTask.outputData) {
                result = extractTask.outputData.result;
            } else {
                result = "UNKNOWN";
            }
        } else {
            result = "UNKNOWN";
        }

        return res.status(200).json({
            sentiment: result,
            originalText: text,
            workflowId: workflowId
        });
    } catch (error) {
        console.error("Error processing sentiment analysis:", error);
        return res.status(500).json({
            error: "Failed to process sentiment analysis",
            message: error.message
        });
    }
} 