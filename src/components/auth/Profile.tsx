import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext"; // adjust if your auth context is elsewhere

export default function Profile() {
    const { user } = useAuth(); // assumes user object has .id
    const [profile, setProfile] = useState({
        name: "",
        city: "",
        state: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch profile on mount
    useEffect(() => {
        if (!user) return;
        setLoading(true);
        console.log("Fetching profile for user:", user.id);
        supabase
            .from("accounts")
            .select("*")
            .eq("uid", user.id)
            .single()
            .then(async ({ data, error }) => {
                console.log("Profile data:", data);
                if (data) {
                    setProfile({
                        name: data.name || "",
                        city: data.city || "",
                        state: data.state || "",
                    });
                } else if (!data) {
                    // No profile exists, so create one
                    console.log("No profile exists, so creating one");
                    const emptyProfile = {
                        uid: user.id,
                        name: "",
                        city: "",
                        state: "",
                    };
                    const { error: insertError } = await supabase
                        .from("accounts")
                        .insert([emptyProfile]);
                    if (!insertError) {
                        setProfile({
                            name: "",
                            city: "",
                            state: "",
                        });
                    }
                }
                setLoading(false);
            });
    }, [user]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    // Save profile to Supabase
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const updates = {
            ...profile,
            uid: user.id,
        };

        const { error } = await supabase
            .from("accounts")
            .update(updates)
            .eq("uid", user.id); // Only update where uid matches

        if (error) {
            setMessage("Error saving profile.");
            console.error(error); // also log the error for debug
        } else {
            setMessage("Profile saved!");
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center w-full">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Profile Settings</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            name="city"
                            value={profile.city}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <select
                            name="state"
                            value={profile.state}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        >
                            <option value="">Select a state</option>
                            <option value="AL">AL</option>
                            <option value="AK">AK</option>
                            <option value="AZ">AZ</option>
                            <option value="AR">AR</option>
                            <option value="CA">CA</option>
                            <option value="CO">CO</option>
                            <option value="CT">CT</option>
                            <option value="DE">DE</option>
                            <option value="FL">FL</option>
                            <option value="GA">GA</option>
                            <option value="HI">HI</option>
                            <option value="ID">ID</option>
                            <option value="IL">IL</option>
                            <option value="IN">IN</option>
                            <option value="IA">IA</option>
                            <option value="KS">KS</option>
                            <option value="KY">KY</option>
                            <option value="LA">LA</option>
                            <option value="ME">ME</option>
                            <option value="MD">MD</option>
                            <option value="MA">MA</option>
                            <option value="MI">MI</option>
                            <option value="MN">MN</option>
                            <option value="MS">MS</option>
                            <option value="MO">MO</option>
                            <option value="MT">MT</option>
                            <option value="NE">NE</option>
                            <option value="NV">NV</option>
                            <option value="NH">NH</option>
                            <option value="NJ">NJ</option>
                            <option value="NM">NM</option>
                            <option value="NY">NY</option>
                            <option value="NC">NC</option>
                            <option value="ND">ND</option>
                            <option value="OH">OH</option>
                            <option value="OK">OK</option>
                            <option value="OR">OR</option>
                            <option value="PA">PA</option>
                            <option value="RI">RI</option>
                            <option value="SC">SC</option>
                            <option value="SD">SD</option>
                            <option value="TN">TN</option>
                            <option value="TX">TX</option>
                            <option value="UT">UT</option>
                            <option value="VT">VT</option>
                            <option value="VA">VA</option>
                            <option value="WA">WA</option>
                            <option value="WV">WV</option>
                            <option value="WI">WI</option>
                            <option value="WY">WY</option>
                        </select>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                    {message && (
                        <div className="mt-4 text-center text-sm font-medium">
                            <span className={message.includes("Error") ? "text-red-500" : "text-green-500"}>
                                {message}
                            </span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
