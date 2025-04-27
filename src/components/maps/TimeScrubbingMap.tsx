import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export const TimeScrubbingMap = () => {
    const [year, setYear] = useState(2020);
    const years = [2020, 2021, 2022, 2023, 2024];

    const [budgetEntries, setBudgetEntries] = useState<
        {
            year: number;
            department: string;
            category: string;
            subcategory: string;
            amount_usd: number;
            fund_source: string;
            geographic_area: string;
            fiscal_period: string;
            purpose: string;
        }[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getDocumentData = async () => {
        try {
            const response = await fetch("/api/docs-get", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to process documents");
            }

            const data = await response.json();
            console.log("Document processing result:", data);
            setBudgetEntries(data.entries[0].budget_entries || []);
            console.log("Budget entries:", data.entries[0].budget_entries);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unknown error");
            }
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unknown error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDocumentData();
    }, []);

    const { user } = useAuth();

    const [profile, setProfile] = useState(null);

    const [coordinates, setCoordinates] = useState<number[]>([0, 0]);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from("accounts")
                .select("*")
                .eq("uid", user.id);
            if (error) {
                console.error("Error fetching profile:", error);
            } else {
                console.log("Profile data:", data);
                setProfile(data[0]);
                if (data[0]?.city) {
                    try {
                        const response = await fetch("/api/get-coordinates", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                address: data[0].city + ", " + data[0].state,
                            }),
                        });

                        if (response.ok) {
                            const result = await response.json();
                            setCoordinates([
                                result.coordinates.lat,
                                result.coordinates.lng,
                            ]);
                            console.log("Coordinates:", result);
                        } else {
                            console.error(
                                "Failed to fetch coordinates:",
                                response.statusText
                            );
                        }
                    } catch (err) {
                        console.error("Error fetching coordinates:", err);
                    }
                } else {
                    setCoordinates([0, 0]);

                    console.error("City not found in profile data");
                }
            }
        };

        fetchProfile();
    }, [user.id]);

    if (!profile) {
        return (
            <Card className="shadow-md">
                <CardContent className="pt-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Loading profile... (Make sure to set your city
                                and state in the profile)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!coordinates) {
        return (
            <Card className="shadow-md">
                <CardContent className="pt-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Loading coordinates... (Make sure to set your
                                city and state in the profile)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Sample budget data - this would be replaced with real data from Supabase
    const budgetFeatures = {
        type: "FeatureCollection",
        features:
            coordinates[0] !== 0 && coordinates[1] !== 0
                ? budgetEntries.map((entry, index) => ({
                      properties: {
                          name: entry.subcategory || `Subcategory ${index + 1}`,
                          budget2020:
                              entry.year === 2020
                                  ? entry.amount_usd * (Math.random() * 1000)
                                  : Math.random() * 100,
                          budget2021:
                              entry.year === 2021
                                  ? entry.amount_usd * (Math.random() * 1000)
                                  : Math.random() * 100,
                          budget2022:
                              entry.year === 2022
                                  ? entry.amount_usd * (Math.random() * 1000)
                                  : Math.random() * 100,
                          budget2023:
                              entry.year === 2023
                                  ? entry.amount_usd * (Math.random() * 1000)
                                  : Math.random() * 100,
                          budget2024:
                              entry.year === 2024
                                  ? entry.amount_usd * (Math.random() * 1000)
                                  : Math.random() * 100,
                      },
                      coordinates: [
                          coordinates[1] + (Math.random() - 0.5) * 0.1, // Randomized nearby longitude
                          coordinates[0] + (Math.random() - 0.5) * 0.1, // Randomized nearby latitude
                      ],
                  }))
                : [],
    };

    return (
        <Card className="shadow-md">
            <CardContent className="pt-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                        Budget Distribution by Year: {year}
                    </h3>
                    <Slider
                        value={[years.indexOf(year)]}
                        min={0}
                        max={years.length - 1}
                        step={1}
                        onValueChange={(value) => setYear(years[value[0]])}
                    />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        {years.map((y) => (
                            <span key={y}>{y}</span>
                        ))}
                    </div>
                </div>
                <div className="h-[400px] relative">
                    {coordinates && coordinates[0] && coordinates[1] && (
                        <MapContainer
                            center={[coordinates[0], coordinates[1]]}
                            zoom={11}
                            className="h-full w-full rounded-md"
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {budgetFeatures.features.map((feature, index) => {
                                const currentBudget =
                                    feature.properties[`budget${year}`];
                                const radius = Math.sqrt(currentBudget);

                                return (
                                    <CircleMarker
                                        key={index}
                                        center={[
                                            feature.coordinates[1],
                                            feature.coordinates[0],
                                        ]}
                                        radius={radius}
                                        fillColor={
                                            currentBudget > 90
                                                ? "#EF4444" // Red
                                                : currentBudget > 80
                                                ? "#F97316" // Orange
                                                : currentBudget > 70
                                                ? "#F59E0B" // Amber
                                                : currentBudget > 60
                                                ? "#EAB308" // Yellow
                                                : currentBudget > 50
                                                ? "#84CC16" // Lime
                                                : currentBudget > 40
                                                ? "#22C55E" // Green
                                                : currentBudget > 30
                                                ? "#10B981" // Emerald
                                                : currentBudget > 20
                                                ? "#06B6D4" // Cyan
                                                : currentBudget > 10
                                                ? "#3B82F6" // Blue
                                                : currentBudget > 5
                                                ? "#6366F1" // Indigo
                                                : currentBudget > 2
                                                ? "#8B5CF6" // Violet
                                                : currentBudget > 1
                                                ? "#A855F7" // Purple
                                                : currentBudget > 0.5
                                                ? "#D946EF" // Fuchsia
                                                : currentBudget > 0.1
                                                ? "#EC4899" // Pink
                                                : "#F43F5E" // Rose
                                        }
                                        color="white"
                                        weight={1}
                                        opacity={1}
                                        fillOpacity={0.7}
                                    >
                                        <Popup>
                                            <strong>
                                                {feature.properties.name}
                                            </strong>
                                            <p>
                                                Budget {year}: $
                                                {currentBudget.toLocaleString()}
                                            </p>
                                        </Popup>
                                    </CircleMarker>
                                );
                            })}
                        </MapContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
