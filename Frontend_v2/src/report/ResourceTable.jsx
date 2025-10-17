// src/components/ResourceTable.jx
import React from "react";

const ResourceTable = ({ resources, onEdit, onActive }) => {
  return (
    <div className="overflow-x-auto max-h-[450px] relative shadow-md sm:rounded-lg bg-[#2a2a2a]">
      <table className="w-full  text-sm text-left text-gray-300">
        <thead className="text-xs text-white uppercase bg-gray-700">
          <tr>
            <th scope="col" className="py-3 px-6">
              Employee ID
            </th>
            <th scope="col" className="py-3 px-6">
              Username
            </th>
            <th scope="col" className="py-3 px-6">
              Email
            </th>
            <th scope="col" className="py-3 px-6">
              Role
            </th>
            <th scope="col" className="py-3 px-6">
              Team
            </th>
            <th scope="col" className="py-3 px-6 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {resources.length > 0 ? (
            resources.map((resource) => (
              <tr
                key={resource.id}
                className="border-b border-gray-700 hover:bg-gray-600"
              >
                <td className="py-4 px-6">{resource.employeeId}</td>
                <td className="py-4 px-6 font-medium text-white">
                  {resource.username}
                </td>
                <td className="py-4 px-6">{resource.email}</td>
                <td className="py-4 px-6">{resource.role}</td>
                <td className="py-4 px-6">{resource.team}</td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onEdit(resource)}
                    className="font-medium text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      onActive({
                        employeeId: resource.employeeId,
                        isActive: !resource.isActive,
                      })
                    }
                    className="font-medium text-red-500 hover:underline"
                  >
                    {resource.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No resources found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;
