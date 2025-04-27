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
      population: profile.population ? parseInt(profile.population, 10) : null,
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
          <input
            name="state"
            value={profile.state}
            onChange={handleChange}
            className="border p-2 w-full"
          />
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
