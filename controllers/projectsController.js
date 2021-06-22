const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.projectsHome = async (req, res) => {
  const projects = await Projects.findAll();

  res.render('index', {
    pageTitle: 'Projects',
    projects,
  });
};

exports.projectsForm = async (req, res) => {
  const projects = await Projects.findAll();

  res.render('new-project', {
    pageTitle: 'New Project',
    projects,
  });
};

exports.newProject = async (req, res) => {
  const projects = await Projects.findAll();

  const { name } = req.body;
  let errors = [];

  // Validate input
  if (!name) {
    errors.push({ msg: 'Add a project name' });
  }

  if (errors.length > 0) {
    res.render('new-project', {
      pageTitle: 'New Project',
      errors,
      projects,
    });
  } else {
    await Projects.create({ name });
    res.redirect('/');
  }
};

exports.projectsByUrl = async (req, res, next) => {
  const projectsPromise = await Projects.findAll();

  const projectPromise = await Projects.findOne({
    where: {
      url: req.params.url,
    },
  });

  const [projects, project] = await Promise.all([
    projectsPromise,
    projectPromise,
  ]);

  const tasks = await Tasks.findAll({
    where: {
      projectId: project.id,
    },
    include: {
      model: Projects,
    },
  });

  if (!project) return next();

  res.render('tasks', {
    pageTitle: 'Project Tasks',
    project,
    projects,
    tasks,
  });
};

exports.editProjectForm = async (req, res) => {
  const projectsPromise = Projects.findAll();

  const projectPromise = Projects.findOne({
    where: {
      id: req.params.id,
    },
  });

  const [projects, project] = await Promise.all([
    projectsPromise,
    projectPromise,
  ]);

  res.render('new-project', {
    pageTitle: 'Edit Project',
    project,
    projects,
  });
};

exports.updateProject = async (req, res) => {
  const projectsPromise = Projects.findAll();
  const projectPromise = Projects.findOne({
    where: {
      id: req.params.id,
    },
  });

  const [projects, project] = await Promise.all([
    projectsPromise,
    projectPromise,
  ]);

  const { name } = req.body;
  let errors = [];

  // Validate input
  if (!name) {
    errors.push({ msg: 'Add a project name' });
  }

  if (errors.length > 0) {
    res.render('new-project', {
      pageTitle: 'Edit Project',
      errors,
      project,
      projects,
    });
  } else {
    await Projects.update({ name }, { where: { id: req.params.id } });
    res.redirect('/');
  }
};

exports.deleteProject = async (req, res, next) => {
  const { projectUrl } = req.query;

  const result = await Projects.destroy({
    where: {
      url: projectUrl,
    },
  });

  if (!result) return next();

  res.status(200).send('Your project has been deleted.');
};
