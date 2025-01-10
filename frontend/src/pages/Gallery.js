import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { gql, useQuery, useMutation } from "@apollo/client";
import Loading from "../components/Loading";
import Error from "../components/Error";

const GET_GALLERY = gql`
  query {
    gallery {
      villageId
      id
      description
      URL
    }
  }
`;

const GET_VILLAGES = gql`
  query {
    villages {
      id
      name
    }
  }
`;

const ADD_IMAGE = gql`
  mutation AddImage($description: String!, $URL: String!, $villageId: Int!) {
    addImage(description: $description, URL: $URL, villageId: $villageId) {
      id
      description
      URL
      villageId
    }
  }
`;

const Gallery = () => {
  const [description, setDescription] = useState("");
  const [URL, setURL] = useState("");
  const [villageId, setVillageId] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_GALLERY);

  const {
    data: villageData,
    loading: villageLoading,
    error: villageError,
  } = useQuery(GET_VILLAGES);

  const [addImage] = useMutation(ADD_IMAGE);

  if (loading || villageLoading) return <Loading />;
  if (error || villageError) return <Error />;

  const images = data?.gallery || [];
  const villages = villageData?.villages || [];

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      await addImage({
        variables: {
          description,
          URL,
          villageId: parseInt(villageId, 10),
        },
      });
      closeAddModal();
      setDescription("");
      setURL("");
      setVillageId("");
      alert("Image added successfully!");
    } catch (err) {
      console.error("Error adding image:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      <main className="flex-1 p-6 ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Gallery</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={openAddModal}
          >
            Add New Image
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-gray-800 p-4 rounded shadow-md flex flex-col items-center"
            >
              <img
                src={image.URL}
                alt={image.description}
                className="w-full h-auto max-w-xs mb-4 rounded"
              />
              <p className="text-sm text-center">{image.description}</p>
            </div>
          ))}
        </div>

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-11/12 max-w-lg">
              <h2 className="text-lg font-bold mb-4">Add New Image</h2>
              <form onSubmit={handleAddImage}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Image URL</label>
                  <input
                    type="text"
                    value={URL}
                    onChange={(e) => setURL(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter image URL"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Image Village
                  </label>
                  <select
                    value={villageId}
                    onChange={(e) => setVillageId(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                    required
                  >
                    <option value="" disabled>
                      Select a village
                    </option>
                    {villages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                    onClick={closeAddModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Image
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
