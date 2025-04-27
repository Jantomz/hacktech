import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    const { uid } = req.body;

    const { data, error } = await supabase
        .from("budget_entries")
        .select("*")
        .eq("uid", uid);

    if (error) {
        return res
            .status(500)
            .json({ error: `Error fetching budget entries: ${error.message}` });
    }

    return res.status(200).json({ entries: data });
}
