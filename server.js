const express = require('express');
const db = require('./config/connection');

const {User} = require('./models');
const {Thought} = require('./models');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/users', (req, res) => {
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

  app.get('/api/users/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
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

  app.post('/api/users/:id/friends/:friendId', (req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { friends: req.params.friendId } },
      { new: true },
      (err, user) => {
        if (err) {
          console.log('Uh Oh, something went wrong');
          res.status(500).json({ error: 'Something went wrong' });
        } else {
          res.status(201).json(user);
        }
      }
    );
  });

  app.delete('/api/users/:id/friends/:friendId', (req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { friends: req.params.friendId } },
      { new: true },
      (err, user) => {
        if (err) {
          console.log('Uh Oh, something went wrong');
          res.status(500).json({ error: 'Something went wrong' });
        } else {
          res.status(201).json(user);
        }
      }
    );
  });
  
  

  app.post('/api/thoughts/:username/', (req, res) => {
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
  
  

app.get('/api/thoughts', (req, res) => {
    
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