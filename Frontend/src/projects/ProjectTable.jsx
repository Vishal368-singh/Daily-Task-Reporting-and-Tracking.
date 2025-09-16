import React from "react";

const ProjectTable = ({ projects, onDelete, onEdit }) => {
  return (
    <div className="overflow-hidden bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700">
    
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
                className="border-b border-gray-700 hover:bg-gray-700 transition"
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
  );
};

export default ProjectTable;
