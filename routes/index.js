const express = require('express');
const router = express.Router();

// Import express-validator for body
const { body } = require('express-validator');

// Controllers
const projectsController = require('../controllers/projectsController');
const tasksController = require('../controllers/tasksController');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

module.exports = function () {
  // Home routes
  router.get('/',
    authController.isAuthenticatedUser,
    projectsController.projectsHome);
  router.get('/new-project',
    authController.isAuthenticatedUser,
    projectsController.projectsForm);
  router.post(
    '/new-project',
    authController.isAuthenticatedUser,
    body('name').not().isEmpty().trim().escape(),
    projectsController.newProject
  );

  // Projects list
  router.get('/projects/:url',
    authController.isAuthenticatedUser,
    projectsController.projectsByUrl);

  // Update project
  router.get('/project/edit/:id',
    authController.isAuthenticatedUser,
    projectsController.editProjectForm);
  router.post(
    '/new-project/:id',
    authController.isAuthenticatedUser,
    body('name').not().isEmpty().trim().escape(),
    projectsController.updateProject
  );

  // Delete project
  router.delete('/projects/:url',
    authController.isAuthenticatedUser,
    projectsController.deleteProject);

  // Add task
  router.post('/projects/:url',
    authController.isAuthenticatedUser,
    tasksController.addTask);

  // Update task
  router.patch('/tasks/:id',
    authController.isAuthenticatedUser,
    tasksController.changeTaskState);

  // Delete task
  router.delete('/tasks/:id',
    authController.isAuthenticatedUser,
    tasksController.deleteTask);

  // New user page
  router.get('/new-user', usersController.createUserForm);

  // Add user
  router.post('/new-user', usersController.createUser);

  // Login page
  router.get('/login', usersController.loginForm);

  // Login auth
  router.post('/login', authController.authUser);

  // Logout
  router.get('/logout', authController.logout);

  return router;
};
