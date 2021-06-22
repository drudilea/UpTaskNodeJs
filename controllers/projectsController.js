const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.projectsHome = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({
    where: {
      userId,
    },
  });

  res.render('index', {
    pageTitle: 'Projects',
    projects,
  });
};

exports.projectsForm = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({
    where: {
      userId,
    },
  });

  res.render('new-project', {
    pageTitle: 'New Project',
    projects,
  });
};

exports.newProject = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({
    where: {
      userId,
    },
  });

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
    const userId = res.locals.user.id;
    await Projects.create({ name, userId });
    res.redirect('/');
  }
};

exports.projectsByUrl = async (req, res, next) => {
  const userId = res.locals.user.id;
  const projectsPromise = Projects.findAll({
    where: {
      userId,
    },
  });

  const projectPromise = await Projects.findOne({
    where: {
      url: req.params.url,
      userId,
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
    // include: {
    //   model: Projects,
    // },
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
  const userId = res.locals.user.id;
  const projectsPromise = Projects.findAll({
    where: {
      userId,
    },
  });

  const projectPromise = Projects.findOne({
    where: {
      id: req.params.id,
      userId,
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
  const userId = res.locals.user.id;
  const projectsPromise = Projects.findAll({
    where: {
      userId,
    },
  });
  const projectPromise = Projects.findOne({
    where: {
      id: req.params.id,
      userId,
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
