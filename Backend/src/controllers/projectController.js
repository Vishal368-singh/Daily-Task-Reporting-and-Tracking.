import Project from "../models/Project.js";

export const createproject = async (req, res) => {
  try {
    const { projectName, client, projectLead, category, modules } = req.body;
    if (!projectName || !client || !projectLead || !category || !modules) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newProject = new Project({
      projectName,
      client,
      projectLead,
      category,
      modules,
    });
    await newProject.save();
    res.status(201).json({
      message: "Project submitted successfully!",
      project: newProject,
    });
  } catch (error) {
    res.status(500).json({ message: "server error" + error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.find();
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "server error" + error.message });
  }
};
