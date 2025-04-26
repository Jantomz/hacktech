import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    GeoJSON,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

// Fake GeoJSON for district boundaries
const districtGeoJson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                name: "Downtown",
                budget2022: 7500000,
                budget2023: 8200000,
                budget2024: 9100000,
                budget2025: 10500000,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [-122.42, 37.77],
                        [-122.4, 37.77],
                        [-122.4, 37.79],
                        [-122.42, 37.79],
                        [-122.42, 37.77],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "North District",
                budget2022: 5200000,
                budget2023: 6100000,
                budget2024: 6800000,
                budget2025: 7300000,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [-122.42, 37.79],
                        [-122.4, 37.79],
                        [-122.4, 37.81],
                        [-122.42, 37.81],
                        [-122.42, 37.79],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "East District",
                budget2022: 4800000,
                budget2023: 5500000,
                budget2024: 6300000,
                budget2025: 7100000,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [-122.4, 37.77],
                        [-122.38, 37.77],
                        [-122.38, 37.79],
                        [-122.4, 37.79],
                        [-122.4, 37.77],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "South District",
                budget2022: 4300000,
                budget2023: 4900000,
                budget2024: 5600000,
                budget2025: 6200000,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [-122.4, 37.75],
                        [-122.38, 37.75],
                        [-122.38, 37.77],
                        [-122.4, 37.77],
                        [-122.4, 37.75],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "West District",
                budget2022: 3900000,
                budget2023: 4400000,
                budget2024: 5100000,
                budget2025: 5800000,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [-122.44, 37.77],
                        [-122.42, 37.77],
                        [-122.42, 37.79],
                        [-122.44, 37.79],
                        [-122.44, 37.77],
                    ],
                ],
            },
        },
    ],
};

// Fake project data
const projectsData = [
    {
        id: 1,
        name: "Downtown Revitalization",
        lat: 37.778,
        lng: -122.412,
        budget: 2500000,
        category: "Infrastructure",
    },
    {
        id: 2,
        name: "North Park Renovation",
        lat: 37.8,
        lng: -122.41,
        budget: 1200000,
        category: "Parks & Recreation",
    },
    {
        id: 3,
        name: "East Side Community Center",
        lat: 37.782,
        lng: -122.39,
        budget: 3800000,
        category: "Community Services",
    },
    {
        id: 4,
        name: "South Transit Hub",
        lat: 37.76,
        lng: -122.405,
        budget: 4500000,
        category: "Transportation",
    },
    {
        id: 5,
        name: "West Medical Facility",
        lat: 37.785,
        lng: -122.435,
        budget: 6300000,
        category: "Healthcare",
    },
];

// Map center (San Francisco)
const defaultCenter: [number, number] = [37.777, -122.41];

// Year slider component
const YearControl = ({
    year,
    setYear,
}: {
    year: number;
    setYear: (year: number) => void;
}) => {
    return (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white dark:bg-card rounded-md shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Budget Year</h3>
                <span className="bg-budget-primary text-white px-2 py-1 rounded text-sm font-medium">
                    {year}
                </span>
            </div>
            <Slider
                value={[year]}
                min={2022}
                max={2025}
                step={1}
                onValueChange={(value) => setYear(value[0])}
                className="my-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
            </div>
        </div>
    );
};

// Function to get color based on budget amount
const getColor = (budget: number): string => {
    if (budget > 9000000) return "#0D9488"; // budget-primary
    if (budget > 7000000) return "#14B8A6";
    if (budget > 5000000) return "#2DD4BF";
    if (budget > 3000000) return "#5EEAD4";
    return "#99F6E4";
};

// Style for the GeoJSON districts
const districtStyle = (
    feature: GeoJSON.Feature<GeoJSON.Geometry, Record<string, unknown>>,
    year: number
) => {
    const budget = feature.properties[`budget${year}`] as number;
    return {
        fillColor: getColor(budget),
        weight: 1,
        opacity: 1,
        color: "#0F172A", // budget-secondary
        fillOpacity: 0.7,
    };
};

// BudgetMap component
const BudgetMap = () => {
    const [year, setYear] = useState(2025);

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Budget Allocation by District</CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative">
                <div className="map-container">
                    <MapContainer
                        center={defaultCenter}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* District boundaries with budget data */}
                        <GeoJSON
                            data={districtGeoJson as GeoJSON.FeatureCollection}
                            style={(feature: GeoJSON.Feature) =>
                                districtStyle(feature, year)
                            }
                            onEachFeature={(
                                feature: GeoJSON.Feature,
                                layer
                            ) => {
                                const budget =
                                    feature.properties[`budget${year}`];
                                layer.bindPopup(`
                  <strong>${feature.properties.name}</strong><br/>
                  ${year} Budget: $${budget.toLocaleString()}
                `);
                            }}
                        />

                        {/* Project markers */}
                        {projectsData.map((project) => (
                            <CircleMarker
                                key={project.id}
                                center={[project.lat, project.lng]}
                                radius={Math.sqrt(project.budget) / 500}
                                fillColor="#F59E0B"
                                color="#F59E0B"
                                weight={1}
                                opacity={0.8}
                                fillOpacity={0.6}
                            >
                                <Popup>
                                    <div>
                                        <h3 className="font-bold">
                                            {project.name}
                                        </h3>
                                        <p>Category: {project.category}</p>
                                        <p>
                                            Budget: $
                                            {project.budget.toLocaleString()}
                                        </p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>

                    <YearControl year={year} setYear={setYear} />
                </div>
            </CardContent>
        </Card>
    );
};

export default BudgetMap;
