import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext"; // adjust if your auth context is elsewhere

export default function Profile() {
    const { user } = useAuth(); // assumes user object has .id
    const [profile, setProfile] = useState({
        name: "",
        city: "",
        state: "",
        description: "",
        population: "",
        type: "",
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
                        description: data.description || "",
                        population: data.population?.toString() || "",
                        type: data.type || "",
                    });
                } else if (!data) {
                    // No profile exists, so create one
                    console.log("No profile exists, so creating one");
                    const emptyProfile = {
                        uid: user.id,
                        name: "",
                        city: "",
                        state: "",
                        description: "",
                        population: null,
                        type: "",
                    };
                    const { error: insertError } = await supabase
                        .from("accounts")
                        .insert([emptyProfile]);
                    if (!insertError) {
                        setProfile({
                            name: "",
                            city: "",
                            state: "",
                            description: "",
                            population: "",
                            type: "",
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
            population: profile.population
                ? parseInt(profile.population, 10)
                : null,
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
        <div>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label>Name</label>
                    <input
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label>City</label>
                    <input
                        name="city"
                        value={profile.city}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label>State</label>
                    <select
                        name="state"
                        value={profile.state}
                        onChange={handleChange}
                        className="border p-2 w-full"
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
                <div>
                    <label>Description</label>
                    <input
                        name="description"
                        value={profile.description}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label>Population</label>
                    <input
                        name="population"
                        type="number"
                        value={profile.population}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label>Type</label>
                    <input
                        name="type"
                        value={profile.type}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
                {message && <div className="mt-2">{message}</div>}
            </form>
        </div>
    );
}
