import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    const { folderUrl } = req.body;
    const parts = folderUrl.split("/");
    const bucketName = parts[parts.length - 2];
    const folderPath = parts[parts.length - 1];

    const { data: fileList, error } = await supabase.storage
        .from(bucketName)
        .list(folderPath, {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
        });

    if (error) {
        return res
            .status(500)
            .json({ error: `Error fetching file list: ${error.message}` });
    }

    console.log("Fetched file list:", fileList);

    const mp3Files = fileList.filter((file) => file.name.endsWith(".mp3"));

    return res.status(200).json({ files: mp3Files });
}
