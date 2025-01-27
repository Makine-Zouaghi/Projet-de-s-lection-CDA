import express from 'express';
import cors from 'cors';
import { Sequelize, Op } from 'sequelize';
import Joke, { sequelize } from './models/joke.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// API Version prefix
const apiPrefix = '/api/v1';

// Create a new joke
app.post(`${apiPrefix}/jokes`, async (req, res) => {
  try {
    const { question, answer } = req.body;
    const joke = await Joke.create({ question, answer });
    res.status(201).json(joke);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all jokes
app.get(`${apiPrefix}/jokes`, async (req, res) => {
  try {
    const jokes = await Joke.findAll();
    res.json(jokes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a random joke
app.get(`${apiPrefix}/jokes/random`, async (req, res) => {
  try {
    const joke = await Joke.findOne({
      // Pass an array with Sequelize.literal
      order: [Sequelize.literal('RANDOM()')],
    });
    if (joke) {
      return res.json(joke);
    }
    
    res.status(404).json({ error: 'No jokes found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific joke by ID
app.get(`${apiPrefix}/jokes/:id`, async (req, res) => {
  try {
    const joke = await Joke.findByPk(req.params.id);
    if (joke) {
      res.json(joke);
    } else {
      res.status(404).json({ error: 'found not' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Initialize database and start server
async function initializeServer() {
  try {
    await sequelize.sync();
    
    // Add initial jokes if the database is empty
    const count = await Joke.count();
    if (count === 0) {
      const initialJokes = [
        { question: "Quelle est la femelle du hamster ?", answer: "L'Amsterdam" },
        { question: "Que dit un oignon quand il se cogne ?", answer: "Aïe" },
        { question: "Quel est l'animal le plus heureux ?", answer: "Le hibou, parce que sa femme est chouette." },
        { question: "Pourquoi le football c'est rigolo ?", answer: "Parce que Thierry en rit" },
        { question: "Quel est le sport le plus fruité ?", answer: "La boxe, parce que tu te prends des pêches dans la poire et tu tombes dans les pommes." },
        { question: "Que se fait un Schtroumpf quand il tombe ?", answer: "Un Bleu" },
        { question: "Quel est le comble pour un marin ?", answer: "Avoir le nez qui coule" },
        { question: "Qu'est ce que les enfants usent le plus à l'école ?", answer: "Le professeur" },
        { question: "Quel est le sport le plus silencieux ?", answer: "Le para-chuuuut" },
        { question: "Quel est le comble pour un joueur de bowling ?", answer: "C'est de perdre la boule" }
      ];
      await Joke.bulkCreate(initialJokes);
    }

    app.listen(port, () => {
      console.log(`API server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

initializeServer();