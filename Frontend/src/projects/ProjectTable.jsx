import React from "react";

const ProjectTable = ({ projects, onDelete, onEdit }) => {
  return (
    <div className="overflow-hidden bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700">
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {projects.length === 0 ? (
          <p className="text-center py-6 text-gray-500 italic">
            No projects available
          </p>
        ) : (
          projects.map((project, idx) => (
            <div
              key={idx}
              className="hover-card-simple p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  {idx + 1}. {project.projectName}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <p><span className="font-medium text-gray-300">Client:</span> {project.client}</p>
                <p><span className="font-medium text-gray-300">Category:</span> {project.category}</p>
                <p><span className="font-medium text-gray-300">Project Lead:</span> {project.projectLead}</p>
                <p><span className="font-medium text-gray-300">Modules:</span> {project.modules?.length > 0 ? project.modules.join(", ") : "-"}</p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => onEdit(project)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => onDelete(project)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="max-h-[450px] hidden md:block overflow-x-auto overflow-y-auto">
        <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-gray-400 font-semibold">
              S. No.
            </th>
            <th className="px-4 py-3 text-left text-gray-400 font-semibold">
              Project
            </th>
            <th className="px-4 py-3 text-left text-gray-400 font-semibold">
              Client
            </th>
            <th className="px-4 py-3 text-left text-gray-400 font-semibold">
              Category
            </th>
            <th className="px-4 py-3 text-left text-gray-400 font-semibold">
              Project Lead
            </th>
            <th className="px-4 py-3 text-left text-gray-400 font-semibold">
              Modules
            </th>
            <th className="px-4 py-3 text-center text-gray-400 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                No projects available
              </td>
            </tr>
          ) : (
            projects.map((project, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.01]"
              >
                <td className="px-4 py-3 text-gray-300">{idx + 1}</td>
                <td className="px-4 py-3 text-gray-300">
                  {project.projectName}
                </td>
                <td className="px-4 py-3 text-gray-300">{project.client}</td>
                <td className="px-4 py-3 text-gray-300">{project.category}</td>
                <td className="px-4 py-3 text-gray-300">
                  {project.projectLead}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {project.modules?.length > 0
                    ? project.modules.join(", ")
                    : "-"}
                </td>
                <td className="px-4 py-3 text-center flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(project)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onDelete(project)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
