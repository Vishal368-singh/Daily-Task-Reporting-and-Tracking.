// src/components/ResourceManagement.js

import React, { useState } from "react";
import Swal from "sweetalert2";
import ResourceTable from "../report/ResourceTable";
import AddResource from "../forms/AddResource";
import { fetchUsers } from "../api/authApi";
import { useEffect } from "react";
import LocalLoadingSpinner from "../common/LocalLoadingSpinner";

// Mock data to start with. In a real app, this would come from an API.

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const fetchData = await fetchUsers();
        setResources(fetchData.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    getUsers();
  }, []);

  // Add Resource
  const handleAdd = (newResource) => {
    newResource.id = `EMP${Math.floor(Math.random() * 1000)}`;
    setResources([...resources, newResource]);
    setIsModalOpen(false);
    Swal.fire("Added!", "New resource has been added.", "success");
  };

  // Set resource to be edited and open modal
  const handleEdit = (resource) => {
    setEditingResource(resource);
  };

  // Update Resource
  const handleUpdate = (updatedResource) => {
    setResources(
      resources.map((r) => (r.id === updatedResource.id ? updatedResource : r))
    );
    setEditingResource(null);
    Swal.fire("Updated!", "Resource details have been updated.", "success");
  };

  // Delete Resource
  const handleDelete = (resourceToDelete) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert deleting "${resourceToDelete.username}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setResources(resources.filter((r) => r.id !== resourceToDelete.id));
        Swal.fire("Deleted!", "The resource has been deleted.", "success");
      }
    });
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
      {/* Table */}
      <ResourceTable
        resources={resources}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add / Update Resource Popup Modal */}
      {(isModalOpen || editingResource !== null) && (
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
