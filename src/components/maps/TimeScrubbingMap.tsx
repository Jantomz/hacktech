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
                            body: JSON.stringify({ address: data[0].city }),
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
                                Loading profile...
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
                                Loading coordinates...
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Sample budget data - this would be replaced with real data from Supabase
    const budgetData = {
        type: "FeatureCollection",
        features: [
            {
                properties: {
                    name: "Downtown",
                    budget2020: 5000000,
                    budget2021: 5200000,
                    budget2022: 5400000,
                    budget2023: 5600000,
                    budget2024: 5800000,
                },
                coordinates: [-74.006, 40.7128], // NYC
            },
            {
                properties: {
                    name: "Westside",
                    budget2020: 3000000,
                    budget2021: 3300000,
                    budget2022: 3500000,
                    budget2023: 3700000,
                    budget2024: 3900000,
                },
                coordinates: [coordinates[1], coordinates[0]], // LA
            },
            {
                properties: {
                    name: "Eastside",
                    budget2020: 2500000,
                    budget2021: 2700000,
                    budget2022: 2900000,
                    budget2023: 3100000,
                    budget2024: 3300000,
                },
                coordinates: [-87.6298, 41.8781], // Chicago
            },
            {
                properties: {
                    name: "Northside",
                    budget2020: 1800000,
                    budget2021: 1900000,
                    budget2022: 2100000,
                    budget2023: 2300000,
                    budget2024: 2500000,
                },
                coordinates: [-95.3698, 29.7604], // Houston
            },
        ],
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
                            zoom={10}
                            className="h-full w-full rounded-md"
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {budgetData.features.map((feature, index) => {
                                const currentBudget =
                                    feature.properties[`budget${year}`];
                                const radius = Math.sqrt(currentBudget) / 100;

                                return (
                                    <CircleMarker
                                        key={index}
                                        center={[
                                            feature.coordinates[1],
                                            feature.coordinates[0],
                                        ]}
                                        radius={radius}
                                        fillColor={
                                            currentBudget > 4000000
                                                ? "#FB7185"
                                                : currentBudget > 2000000
                                                ? "#FBBF24"
                                                : "#4ADE80"
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
