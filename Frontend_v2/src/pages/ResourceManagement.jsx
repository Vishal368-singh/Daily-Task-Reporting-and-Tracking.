// ✅ src/components/ResourceManagement.js
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import ResourceTable from "../report/ResourceTable";
import AddResource from "../forms/AddResource";
import { fetchUsers, isActive } from "../api/authApi";
import LocalLoadingSpinner from "../common/LocalLoadingSpinner";

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const fetchData = await fetchUsers();
      setResources(fetchData.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleAdd = async () => {
    await getUsers();
    setIsModalOpen(false);
  };

  const handleUpdate = async () => {
    await getUsers();
    setEditingResource(null);
  };

  const handleActive = async (resourceForIsActive) => {
    await isActive(resourceForIsActive);
    Swal.fire({
      title: "✅ Success!",
      text: "Employee status changed successfully",
    });
    await getUsers();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Resource Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-900"
        >
          + Add Resource
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg z-10">
          <LocalLoadingSpinner />
        </div>
      )}

      <ResourceTable
        resources={resources}
        onEdit={setEditingResource}
        onActive={handleActive}
      />

      {(isModalOpen || editingResource) && (
        <div className="fixed inset-0 bg-black/5 flex justify-center overflow-y-auto p-8 z-50">
          <div className="w-11/12 md:w-2/3 lg:w-[100%] my-auto">
            <AddResource
              initialData={editingResource}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
