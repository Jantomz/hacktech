export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
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

    const body = req.body;

    let text = body.text;

    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Invalid input text" });
    }

    const removeRedundantWords = (input) => {
        const words = input.split(" ");
        const seen = new Set();
        return words
            .filter((word) => {
                const lowerWord = word.toLowerCase();
                if (seen.has(lowerWord)) {
                    return false;
                }
                seen.add(lowerWord);
                return true;
            })
            .join(" ");
    };

    text = removeRedundantWords(text);

    const removeStopWords = (input) => {
        const stopWords = new Set([
            "and",
            "to",
            "but",
            "or",
            "so",
            "yet",
            "for",
            "nor",
            "a",
            "an",
            "the",
            "in",
            "on",
            "at",
            "with",
            "by",
            "of",
            "as",
            "is",
            "are",
            "was",
            "were",
            "be",
            "been",
            "being",
            "have",
            "has",
            "had",
            "do",
            "does",
            "did",
            "will",
            "would",
            "shall",
            "should",
            "can",
            "could",
            "may",
            "might",
            "must",
        ]);
        return input
            .split(" ")
            .filter((word) => !stopWords.has(word.toLowerCase()))
            .join(" ");
    };

    text = removeStopWords(text);

    try {
        const response = await fetch(
            "https://developer.orkescloud.com/api/workflow/get_similar_embeddings?priority=0",
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

        const data = await response.text();
        console.log("Response from Orkes API for chunk:", data);

        let parsedData;

        do {
            console.log("Waiting for 2 seconds...");

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const workflowResponse = await fetch(
                `https://developer.orkescloud.com/api/workflow/${data}`,
                {
                    method: "GET",
                    headers: {
                        accept: "*/*",
                        "X-Authorization": tokenData.token || "",
                    },
                }
            );

            console.log("Workflow response:", workflowResponse);

            if (!workflowResponse.ok) {
                throw new Error(
                    `Workflow fetch failed with status ${workflowResponse.status}`
                );
            }

            parsedData = await workflowResponse.json();
            console.log("Workflow details:", parsedData.output.result[0].text);
        } while (
            parsedData.output === undefined ||
            parsedData.output.result[0].text === undefined
        );

        console.log("Parsed data:", parsedData.output.result[0].text);

        const prompt = `
        You are Ava, the Atlas Virtual Assistant, a kind and high-spirited government budget interpretability assistant that helps answer questions based on the provided context, which is a transcription portion of a board meeting.
Your goal is to provide accurate, helpful responses based only on the information given.
If the context doesn't contain much relevant information, acknowledge that you don't have enough information.

${parsedData.output.result[0].text}

User question: ${text}

Please provide a helpful response based on the above context.
        
        `;

        const openaiResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4", // Correct model name as per OpenAI documentation
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant.",
                        },
                        { role: "user", content: prompt },
                    ],
                    max_tokens: 150,
                    temperature: 0.4,
                }),
            }
        );

        if (!openaiResponse.ok) {
            throw new Error(
                `OpenAI API call failed with status ${openaiResponse.status}`
            );
        }

        const openaiData = await openaiResponse.json();
        console.log("Response from OpenAI:", openaiData);

        const aiResponse = openaiData.choices[0]?.message;
        if (!aiResponse) {
            throw new Error("No response from OpenAI");
        }

        console.log("AI Response:", aiResponse);

        return res.status(200).json({ data: aiResponse.content });
    } catch (error) {
        console.error("Error processing chunk:", error);
    }
}
