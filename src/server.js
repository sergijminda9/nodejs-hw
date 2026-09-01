const express = require('express');
const cors = require('cors');
const pino = require('pino-http');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pino());

  app.get('/notes', (req, res) => {
    res.status(200).json({
      message: 'Retrieved all notes',
    });
  });

  app.get('/notes/:noteId', (req, res) => {
    const { noteId } = req.params;
    res.status(200).json({
      message: `Retrieved note with ID: ${noteId}`,
    });
  });

  app.get('/test-error', () => {
    throw new Error('Simulated server error');
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Route not found',
    });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = setupServer;
