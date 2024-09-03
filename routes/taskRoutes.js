const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /api/tasks - Retrieve all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  const { title, email, description } = req.body;

  // Validate required fields
  if (!title || !email) {
    return res.status(400).json({ message: 'Title and Email are required.' });
  }

  const task = new Task({
    title,
    email,
    description,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id - Update an existing task by its ID
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (req.body.title != null) {
      task.title = req.body.title;
    }
    if (req.body.email != null) {
      task.email = req.body.email;
    }
    if (req.body.description != null) {
      task.description = req.body.description;
    }
    if (req.body.completed != null) {
      task.completed = req.body.completed;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id - Delete a task by its ID
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    await task.remove();
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
