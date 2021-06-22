const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.addTask = async (req, res, next) => {
  const project = await Projects.findOne({ where: { url: req.params.url } });
  const { task } = req.body;
  const state = 0;
  const projectId = project.id;

  const result = await Tasks.create({ task, state, projectId });

  if (!result) return next();

  res.redirect(`/projects/${req.params.url}`);
};

exports.changeTaskState = async (req, res, next) => {
  const { id } = req.params;
  const task = await Tasks.findOne({ where: { id } });

  task.state = !task.state;

  const result = await task.save();

  if (!result) return next();

  res.status(200).send('OK');
};

exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  const result = await Tasks.destroy({ where: { id } });

  if (!result) return next();

  res.status(200).send('Task deleted');
};
