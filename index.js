// implement your API here
const express = require('express');

const db = require('./data/db');

const server = express();

server.use(express.json());

// POST: creates a new user
server.post("/api/users", (req, res) => {
    const userData = req.body;
    if (!userData.name || !userData.bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      db.insert(userData)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the user to the database",
          });
        });
    }
  });

// Fetch users from /api/users
server.get("/api/users", (req, res) => {
    db.find()
        .then(users => res.status(201).json(users))
        .error(err => {
            console.log(err);
            res
                .status(500)
                .json({ errorMessage: "The users information could not be retrieved." })
        });
});

// GET:id
server.get('/api/users/:id', (req, res) =>{
    const id = req.params.id;
    db.findById(id).then(user =>{
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    }).catch(error =>{
        console.log(`Error: ${error}`);
        res.status(500).json({ error: "The user information could not be retrieved." });
    });
});

// DELETE
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(userData => {
            if(userData > 0){
                res.status(200).json({ response: `Deleted user with id: ${id}`})
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user could not be removed." })
        });
});

// PUT: update user information
server.put('/api/users/:id', (request, response) =>{
    const id = request.params.id;
    const user = request.body;

    if(user.name || user.bio){
        db.update(id, user).then(result =>{
            if(result > 0){
                response.status(200).json(user);
            }else{
                response.status(404).json({ message: "The user with the specified ID does not exist." });
            }
            
        }).catch(error =>{
            console.log(`Error: ${error}`);
            response.status(500).json({ error: "The user information could not be modified." });
        });
    }else{
        response.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
});



const port = 8000;
server.listen(port, () => console.log(`\n **api on port:${port}** \n`))