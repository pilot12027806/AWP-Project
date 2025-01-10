import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { gql, useQuery, useMutation } from "@apollo/client";
import Loading from "../components/Loading";
import Error from "../components/Error";

const GET_VILLAGES = gql`
  query {
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
        gender
        ratio
      }
      populationGrowthRate
      ageDist {
        ageGroup
        percentage
      }
    }
  }
`;

const ADD_VILLAGE = gql`
  mutation AddVillage(
    $name: String!
    $region: String!
    $population: Int!
    $landArea: Float!
    $latitude: Float!
    $longitude: Float!
    $tags: [String!]!
  ) {
    addVillage(
      name: $name
      region: $region
      population: $population
      landArea: $landArea
      latitude: $latitude
      longitude: $longitude
      tags: $tags
    ) {
      id
      name
      region
      population
      landArea
      latitude
      longitude
      tags
    }
  }
`;

const UPDATE_VILLAGE = gql`
  mutation UpdateVillage(
    $id: Int!
    $name: String
    $region: String
    $population: Int
    $landArea: Float
    $latitude: Float
    $longitude: Float
  ) {
    updateVillage(
      id: $id
      name: $name
      region: $region
      population: $population
      landArea: $landArea
      latitude: $latitude
      longitude: $longitude
    ) {
      id
      name
      region
      population
      landArea
      latitude
      longitude
    }
  }
`;

const ADD_UPDATE_VILLAGE_DEMO_DATA = gql`
  mutation AddUpdateVillageDemoData(
    $id: Int!
    $ageDist: [AgeDistInput]
    $genderRatio: [GenderRatioInput]
    $populationGrowthRate: Float
  ) {
    addUpdateVillageDemoData(
      id: $id
      ageDist: $ageDist
      genderRatio: $genderRatio
      populationGrowthRate: $populationGrowthRate
    ) {
      id
      name
      ageDist {
        ageGroup
        percentage
      }
      genderRatio {
        gender
        ratio
      }
      populationGrowthRate
    }
  }
`;

const DELETE_VILLAGE = gql`
  mutation DeleteVillage($id: Int!) {
    deleteVillage(id: $id)
  }
`;

const VillageManagement = () => {
  const { loading, error, data, refetch } = useQuery(GET_VILLAGES);
  const [addVillage] = useMutation(ADD_VILLAGE);
  const [updateVillage] = useMutation(UPDATE_VILLAGE);
  const [addUpdateVillageDemoData] = useMutation(ADD_UPDATE_VILLAGE_DEMO_DATA);
  const [deleteVillage] = useMutation(DELETE_VILLAGE);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isDemographicModalOpen, setDemographicModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedVillage, setSelectedVillage] = useState(null);
  const [villages, setVillages] = useState([]);
  const [newVillage, setNewVillage] = useState({
    name: "",
    region: "",
    landArea: 0,
    latitude: "",
    longitude: "",
    tags: [],
  });

  useEffect(() => {
    if (data?.villages) {
      setVillages(data.villages);
    }
  }, [data]);

  const handleAddVillage = async () => {
    try {
      await addVillage({ variables: newVillage });
      setAddModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to add village:", err);
    }
  };

  const handleUpdateVillage = async () => {
    try {
      await updateVillage({
        variables: { id: selectedVillage.id, ...newVillage },
      });
      setUpdateModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to update village:", err);
    }
  };

  const handleAddUpdateDemographicData = async () => {
    try {
      await addUpdateVillageDemoData({
        variables: {
          id: selectedVillage.id,
          ageDist: selectedVillage.ageDist,
          genderRatio: selectedVillage.genderRatio,
          populationGrowthRate: selectedVillage.populationGrowthRate,
        },
      });
      setDemographicModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to update demographic data:", err);
    }
  };

  const handleDeleteVillage = async () => {
    try {
      await deleteVillage({ variables: { id: selectedVillage.id } });
      setDeleteModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to delete village:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Village Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setAddModalOpen(true)}
          >
            Add New Village
          </button>
        </div>
        {villages.length > 0 ? (
          <div className="space-y-4">
            {villages.map((village) => (
              <div
                key={village.id}
                className="bg-gray-800 p-4 rounded flex items-center justify-between"
              >
                <span>
                  {village.name} - {village.region}
                </span>
                <div className="space-x-2">
                  <button
                    className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600"
                    onClick={() => {
                      setSelectedVillage(village);
                      setViewModalOpen(true);
                      console.log(selectedVillage);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
                    onClick={() => {
                      setSelectedVillage(village);
                      setNewVillage(village);
                      setUpdateModalOpen(true);
                      console.log(selectedVillage);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="bg-orange-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
                    onClick={() => {
                      setSelectedVillage(village);
                      setNewVillage(village);
                      setDemographicModalOpen(true);
                      console.log(selectedVillage);
                    }}
                  >
                    Update Demographic Data
                  </button>
                  <button
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                    onClick={() => {
                      setSelectedVillage(village);
                      setDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No villages available. Add a new village to get started.</p>
        )}
        {/* All Modals */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-11/12 max-w-lg">
              <h2 className="text-lg font-bold mb-4">Add New Village</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddVillage();
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Village Name
                  </label>
                  <input
                    type="text"
                    value={newVillage.name}
                    onChange={(e) =>
                      setNewVillage({ ...newVillage, name: e.target.value })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter village name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Region/District
                  </label>
                  <input
                    type="text"
                    value={newVillage.region}
                    onChange={(e) =>
                      setNewVillage({ ...newVillage, region: e.target.value })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter region or district"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Land Area (sq km)
                  </label>
                  <input
                    type="number"
                    value={newVillage.landArea}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        landArea: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter land area"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    population
                  </label>
                  <input
                    type="number"
                    value={newVillage.population}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        population: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter population"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Latitude</label>
                  <input
                    type="number"
                    value={newVillage.latitude}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        latitude: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter latitude"
                    step="any"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Longitude</label>
                  <input
                    type="number"
                    value={newVillage.longitude}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        longitude: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter longitude"
                    step="any"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Tags</label>
                  <input
                    type="text"
                    value={newVillage.tags.join(", ")}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim()),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter tags (comma-separated)"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                    onClick={() => setAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Village
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Update Village Modal */}
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-11/12 max-w-lg">
              <h2 className="text-lg font-bold mb-4">Update Village</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateVillage();
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Village Name
                  </label>
                  <input
                    type="text"
                    value={newVillage.name}
                    onChange={(e) =>
                      setNewVillage({ ...newVillage, name: e.target.value })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter village name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Region/District
                  </label>
                  <input
                    type="text"
                    value={newVillage.region}
                    onChange={(e) =>
                      setNewVillage({ ...newVillage, region: e.target.value })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter region or district"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Land Area (sq km)
                  </label>
                  <input
                    type="number"
                    value={newVillage.landArea}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        landArea: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter land area"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    population
                  </label>
                  <input
                    type="number"
                    value={newVillage.population}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        population: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter population"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Latitude</label>
                  <input
                    type="number"
                    value={newVillage.latitude}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        latitude: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter latitude"
                    step="any"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Longitude</label>
                  <input
                    type="number"
                    value={newVillage.longitude}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        longitude: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter longitude"
                    step="any"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Tags</label>
                  <input
                    type="text"
                    value={newVillage.tags.join(", ")}
                    onChange={(e) =>
                      setNewVillage({
                        ...newVillage,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim()),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter tags (comma-separated)"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                    onClick={() => setUpdateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update Village
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isDemographicModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-11/12 max-w-lg">
              <h2 className="text-lg font-bold mb-4">
                Add Demographic Data for {selectedVillage?.name}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddUpdateDemographicData();
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Population Size
                  </label>
                  <input
                    type="number"
                    value={selectedVillage.population || ""}
                    onChange={(e) =>
                      setSelectedVillage({
                        ...selectedVillage,
                        population: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter population size"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Age Distribution
                  </label>
                  <input
                    type="text"
                    value={
                      selectedVillage.ageDist
                        ?.map((age) => `${age.ageGroup}: ${age.percentage}%`)
                        .join(", ") || ""
                    }
                    onChange={(e) => {
                      const parsedAgeDist = e.target.value
                        .split(",")
                        .map((entry) => {
                          const [ageGroup, percentage] = entry
                            .split(":")
                            .map((item) => item.trim());
                          return { ageGroup, percentage: parseInt(percentage) };
                        });
                      setSelectedVillage({
                        ...selectedVillage,
                        ageDist: parsedAgeDist,
                      });
                    }}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="e.g., 0-14: 30%, 15-64: 60%, 65+: 10%"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Gender Ratios
                  </label>
                  <input
                    type="text"
                    value={
                      selectedVillage.genderRatio
                        ?.map((gender) => `${gender.gender}: ${gender.ratio}%`)
                        .join(", ") || ""
                    }
                    onChange={(e) => {
                      const parsedGenderRatio = e.target.value
                        .split(",")
                        .map((entry) => {
                          const [gender, ratio] = entry
                            .split(":")
                            .map((item) => item.trim());
                          return { gender, ratio: parseInt(ratio) };
                        });
                      setSelectedVillage({
                        ...selectedVillage,
                        genderRatio: parsedGenderRatio,
                      });
                    }}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="e.g., Male: 51%, Female: 49%"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Population Growth Rate
                  </label>
                  <input
                    type="number"
                    value={selectedVillage.populationGrowthRate || ""}
                    onChange={(e) =>
                      setSelectedVillage({
                        ...selectedVillage,
                        populationGrowthRate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter population growth rate"
                    step="any"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                    onClick={() => setDemographicModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Demographic Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Village Details Modal */}
        {isViewModalOpen && selectedVillage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-11/12 max-w-lg">
              <h2 className="text-lg font-bold mb-4">Village Details</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Village Name:</span>{" "}
                  <span>{selectedVillage.name}</span>
                </div>
                <div>
                  <span className="font-semibold">Region/District:</span>{" "}
                  <span>{selectedVillage.region}</span>
                </div>
                <div>
                  <span className="font-semibold">Land Area (sq km):</span>{" "}
                  <span>{selectedVillage.landArea}</span>
                </div>
                <div>
                  <span className="font-semibold">Latitude:</span>{" "}
                  <span>{selectedVillage.latitude}</span>
                </div>
                <div>
                  <span className="font-semibold">Longitude:</span>{" "}
                  <span>{selectedVillage.longitude}</span>
                </div>
                <div>
                  <span className="font-semibold">Population:</span>{" "}
                  <span>{selectedVillage.population}</span>
                </div>
                <div>
                  <span className="font-semibold">Tags:</span>{" "}
                  <span>{selectedVillage.tags?.join(", ") || "None"}</span>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {isDeleteModalOpen && selectedVillage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6">
                Are you sure you want to delete the village{" "}
                <span className="font-bold text-red-500">
                  {selectedVillage.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVillage}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}{" "}
      </main>
    </div>
  );
};

export default VillageManagement;
