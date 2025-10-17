import Project from "../models/Project.js";

export const createproject = async (req, res) => {
  try {
    // Basic validation
    const { projectName, client, projectLead, category, modules } = req.body;
    if (!projectName || !client || !projectLead || !category || !modules) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parameterized validation / sanitization
    const ProjectData = {
      projectName: projectName.trim(),
      client: client.trim(),
      projectLead: projectLead.trim(),
      category: category.trim(),
      modules: modules.map((m) => String(m).trim()),
    };

    // Correct way to create & save a project
    const newProject = await Project.create(ProjectData);

    res.status(201).json({
      message: "Project submitted successfully!",
      project: newProject,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
