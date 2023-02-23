const express = require('express');
const db = require('./config/connection');

const {User} = require('./models');
const {Thought} = require('./models');
// const REACTION = require('./models/reaction');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/new-user/:username/:email', (req, res) => {
    const newUser = new User({ username: req.body.username, email: req.body.email });
    newUser.save();
    if (newUser) {
      res.status(201).json(newUser);
    } else {
      console.log('Uh Oh, something went wrong');
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  app.get('/api/users', (req, res) => {
    User.find({})
      .populate('thoughts')
      .exec((err, result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          console.log('Uh Oh, something went wrong');
          res.status(500).json({ error: 'Something went wrong' });
        }
      });
  });
  

  app.post('/new-thought/:username/', (req, res) => {
    const newThought = new Thought({
      username: req.params.username,
      thoughtText: req.body.thoughtText,
    });
    
    newThought.save((err, thought) => {
      if (err) {
        console.log('Uh Oh, something went wrong');
        res.status(500).json({ error: 'Something went wrong' });
      } else {
        User.findOneAndUpdate(
          { username: req.params.username },
          { $push: { thoughts: thought._id } },
          { new: true },
          (err, user) => {
            if (err) {
              console.log('Uh Oh, something went wrong');
              res.status(500).json({ error: 'Something went wrong' });
            } else {
              res.status(201).json(thought);
            }
          }
        );
      }
    });
  });
  
  

app.get('/all-thoughts', (req, res) => {
    // Using model in route to find all documents that are instances of that model
    Thought.find({}, (err, result) => {
        if (result) {
            res.status(200).json(result);
        } else {
            console.log('Uh Oh, something went wrong');
            res.status(500).json({ error: 'Something went wrong' });
        }
    });
});


















db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log('Press Ctrl+C to quit.');
    });
})