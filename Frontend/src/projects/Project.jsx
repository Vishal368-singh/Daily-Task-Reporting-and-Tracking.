import React, { useState } from "react";
import Swal from "sweetalert2";
import ProjectTable from "./ProjectTable";
import ProjectForm from "../forms/ProjectForm";
import { getProjects, createProject } from "../api/projectAPI";
import { useEffect } from "react";
import LoadingSpinner from "../common/LoadingSpinner";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null); // To show popup for updateProject
  const [isModalOpen, setIsModalOpen] = useState(false); // To show popup for addProject
  const [loading, setLoading] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data); // Assuming axios response
    } catch (error) {
      Swal.fire("Error", "Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  // Add project (from ProjectForm)
  const handleAdd = async (newProject) => {
    try {
      console.log("Adding project:", newProject);
      const response = await createProject(newProject);
      setProjects([...projects, response.data.project]);
      setIsModalOpen(false);
      Swal.fire("Added!", "Project has been added successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to add project", error);
    }
  };
  // Delete project with confirmation
  const handleDelete = (project) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete project "${project.projectName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setProjects(projects.filter((p) => p !== project));
        Swal.fire("Deleted!", "Project has been deleted.", "success");
      }
    });
  };

  // Delete project
  // const handleDelete = async (project) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: `Delete project "${project.projectName}"?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         await deleteProject(project._id);
  //         setProjects(projects.filter((p) => p._id !== project._id));
  //         Swal.fire("Deleted!", "Project has been deleted.", "success");
  //       } catch (error) {
  //         Swal.fire("Error", "Failed to delete project", "error");
  //       }
  //     }
  //   });
  // };

  // Open project in edit mode
  const handleEdit = (project) => {
    setEditingProject(project);
  };

  // Save updated project
  const handleUpdate = (updatedProject) => {
    setProjects(
      projects.map((p) => (p === editingProject ? { ...updatedProject } : p))
    );
    setEditingProject(null);
    Swal.fire("Updated!", "Project details have been updated.", "success");
  };

  // const handleUpdate = async (updatedProject) => {
  //   try {
  //     const response = await updateProject(editingProject._id, updatedProject);
  //     setProjects(
  //       projects.map((p) =>
  //         p._id === editingProject._id ? response.data.project : p
  //       )
  //     );
  //     setEditingProject(null);
  //     Swal.fire("Updated!", "Project details have been updated.", "success");
  //   } catch (error) {
  //     Swal.fire("Error", "Failed to update project", "error");
  //   }
  // };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      {/* Add project button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white mb-4">
          Project Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-900"
        >
          + Add Project
        </button>
      </div>

      {/* Table */}
      <div className="mt-6">
        <ProjectTable
          projects={projects}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* Add / Update Project Popup */}
      {(isModalOpen || editingProject) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-11/12 md:w-2/3 lg:w-1/2">
            <ProjectForm
              initialData={editingProject}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingProject(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
