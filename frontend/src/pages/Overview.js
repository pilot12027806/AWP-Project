//زيد تعال هون بس دبل تشيك الاحصائيات الي جاي مع المطلوبة
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  BarElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

import Sidebar from "../components/Sidebar";
import { gql, useQuery } from "@apollo/client";
import Loading from "../components/Loading";
import Error from "../components/Error";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title
);

// GraphQL Queries
const GET_STATS = gql`
  query {
    stats {
      totalVillages
      totalPopulation
      averageLandArea
      totalUrbanArea
    }
    villages {
      id
      name
      region
      landArea
      latitude
      longitude
      tags
      population
      genderRatio {
        ratio
        gender
      }
      ageDist {
        percentage
        ageGroup
      }
      populationGrowthRate
    }
  }
`;

const Overview = () => {
  const { loading, error, data } = useQuery(GET_STATS);

  if (loading) return <Loading />;
  if (error) return <Error />;

  const stats = data?.stats || {};
  const villages = data?.villages || [];

  const totalGenderRatios = { Male: 0, Female: 0 };
  const totalAgeRatios = { "0-14": 0, "15-64": 0, "65+": 0 };
  villages.forEach((village) => {
    if (village.genderRatio) {
      village.genderRatio.forEach((item) => {
        if (totalGenderRatios[item.gender] !== undefined) {
          totalGenderRatios[item.gender] += item.ratio;
        } else {
          totalGenderRatios[item.gender] = item.ratio;
        }
      });
    }
  });

  villages.forEach((village) => {
    if (village.ageDist) {
      village.ageDist.forEach((item) => {
        if (totalAgeRatios[item.ageGroup] !== undefined) {
          totalAgeRatios[item.ageGroup] += item.percentage;
        } else {
          totalAgeRatios[item.ageGroup] = item.percentage;
        }
      });
    }
  });
  const totalRatio = totalGenderRatios.Male + totalGenderRatios.Female;
  const totalpercentage =
    totalAgeRatios["0-14"] + totalAgeRatios["15-64"] + totalAgeRatios["65+"];
  totalGenderRatios.Male = (totalGenderRatios.Male / totalRatio) * 100;
  totalGenderRatios.Female = (totalGenderRatios.Female / totalRatio) * 100;
  totalAgeRatios["0-14"] = (totalAgeRatios["0-14"] / totalpercentage) * 100;
  totalAgeRatios["15-64"] = (totalAgeRatios["15-64"] / totalpercentage) * 100;
  totalAgeRatios["65+"] = (totalAgeRatios["65+"] / totalpercentage) * 100;
  const pieDataGender = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Gender Ratios",
        data: [totalGenderRatios.Male, totalGenderRatios.Female],
        backgroundColor: ["#f87171", "#fbbf24"],
      },
    ],
  };

  const pieDataAge = {
    labels: ["0-14", "15-64", "65+"],
    datasets: [
      {
        label: "Age Distrbtion ",
        data: [
          totalAgeRatios["0-14"],
          totalAgeRatios["15-64"],
          totalAgeRatios["65+"],
        ],
        backgroundColor: [
          "#3b82f6",
          "#f87171",
          "#34d399",
          "#60a5fa",
          "#a78bfa",
        ],
      },
    ],
  };

  const barData = {
    labels: villages.map((village) => village.name),
    datasets: [
      {
        label: "Population By Village",
        data: villages.map((village) => village.population),
        backgroundColor: "#4ade80",
        borderColor: "#34d399",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex bg-gray-900">
      <div className="w-64 bg-gray-900">
        <Sidebar />
      </div>

      <main className="flex-1 p-6 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-6">Overview</h1>

        <div className="w-full h-64 md:h-96 mb-6">
          <MapContainer
            center={[31.9522, 35.2034]}
            zoom={8}
            className="h-full w-full rounded-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {villages.map((village) => (
              <Marker
                key={village.id}
                position={[village.latitude, village.longitude]}
              >
                <Popup>{village.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Number of Villages</h3>
            <p className="text-2xl">{stats.totalVillages || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">
              Total Number of Urban Areas
            </h3>
            <p className="text-2xl">{stats.totalUrbanArea || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Population</h3>
            <p className="text-2xl">{stats.totalPopulation || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Average Land Area</h3>
            <p className="text-2xl">
              {stats.averageLandArea?.toFixed(2) || 0} sq km
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
            <div className="w-full h-64">
              <Pie data={pieDataAge} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Gender Ratios</h3>
            <div className="w-full h-64">
              <Pie
                data={pieDataGender}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Population Growth</h3>
          <div className="w-full h-64">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  x: {
                    beginAtZero: true,
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;
