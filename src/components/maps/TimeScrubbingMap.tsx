
import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export const TimeScrubbingMap = () => {
  const [year, setYear] = useState(2020);
  const years = [2020, 2021, 2022, 2023, 2024];

  // Sample budget data - this would be replaced with real data from Supabase
  const budgetData = {
    type: 'FeatureCollection',
    features: [
      {
        properties: {
          name: 'Downtown',
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
          name: 'Westside',
          budget2020: 3000000,
          budget2021: 3300000,
          budget2022: 3500000,
          budget2023: 3700000,
          budget2024: 3900000,
        },
        coordinates: [-118.2437, 34.0522], // LA
      },
      {
        properties: {
          name: 'Eastside',
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
          name: 'Northside',
          budget2020: 1800000,
          budget2021: 1900000,
          budget2022: 2100000,
          budget2023: 2300000,
          budget2024: 2500000,
        },
        coordinates: [-95.3698, 29.7604], // Houston
      },
      {
        properties: {
          name: 'Southside',
          budget2020: 1200000,
          budget2021: 1300000,
          budget2022: 1400000,
          budget2023: 1500000,
          budget2024: 1600000,
        },
        coordinates: [-112.0740, 33.4484], // Phoenix
      },
    ],
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Budget Distribution by Year: {year}</h3>
          <Slider
            value={[years.indexOf(year)]}
            min={0}
            max={years.length - 1}
            step={1}
            onValueChange={(value) => setYear(years[value[0]])}
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            {years.map(y => (
              <span key={y}>{y}</span>
            ))}
          </div>
        </div>
        <div className="h-[400px] relative">
          <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4}
            className="h-full w-full rounded-md"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {budgetData.features.map((feature, index) => {
              const currentBudget = feature.properties[`budget${year}`];
              const radius = Math.sqrt(currentBudget) / 100;
              
              return (
                <CircleMarker
                  key={index}
                  center={[feature.coordinates[1], feature.coordinates[0]]}
                  radius={radius}
                  fillColor={
                    currentBudget > 4000000 ? '#FB7185' :
                    currentBudget > 2000000 ? '#FBBF24' :
                    '#4ADE80'
                  }
                  color="white"
                  weight={1}
                  opacity={1}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <strong>{feature.properties.name}</strong>
                    <p>Budget {year}: ${currentBudget.toLocaleString()}</p>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};
