import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { documentUrl, uid } = req.body;

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
                    document_url: documentUrl,
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
            console.log("Waiting for 20 seconds...");

            await new Promise((resolve) => setTimeout(resolve, 20000));

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

            console.log("Workflow response:", workflowResponse);

            if (!workflowResponse.ok) {
                throw new Error(
                    `Workflow fetch failed with status ${workflowResponse.status}`
                );
            }

            parsedData = await workflowResponse.json();
            console.log("Workflow details:", parsedData.tasks[1].outputData);
        } while (
            parsedData.tasks[1].outputData === undefined ||
            parsedData.tasks[1].outputData.budget_entries === undefined
        );

        console.log("Parsed data:", parsedData);
        const existingEntry = await supabase
            .from("budget_entries")
            .select("*")
            .eq("uid", uid)
            .single();
        console.log("Existing entry:", existingEntry);
        let updatedData;
        if (existingEntry.data) {
            updatedData = {
                budget_entries: [
                    ...existingEntry.data.budget_entries,
                    ...parsedData.tasks[1].outputData.budget_entries,
                ],
            };

            console.log("Updating existing data in Supabase:", updatedData);
            const { error } = await supabase
                .from("budget_entries")
                .update(updatedData)
                .eq("uid", uid);

            if (error) {
                throw new Error(
                    `Failed to update data in Supabase: ${error.message}`
                );
            }
        } else {
            const budgetData = parsedData.tasks[1].outputData.budget_entries;

            updatedData = {
                uid: uid,
                budget_entries: budgetData,
            };
            console.log(
                "No existing data found. Creating new entry:",
                updatedData
            );
            console.log("Inserting new data into Supabase:", updatedData);
            const { error } = await supabase
                .from("budget_entries")
                .insert([updatedData]); // Ensure data is passed as an array

            if (error) {
                throw new Error(
                    `Failed to insert data into Supabase: ${error.message}`
                );
            }
        }

        res.status(200).json({
            data: parsedData.tasks[1].outputData.budget_entries || [],
        });
    } catch (err) {
        console.error("Error fetching chart data:", err);
        res.status(500).json({
            error: "Failed to load chart data. Please check your API key.",
        });
    }
}
