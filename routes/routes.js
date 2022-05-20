const express = require('express');
const Model = require('../models/Article');
const router = express.Router();
/////////////////////////// article routes////////////////////////////////
//Post 
router.post('/article', async (req, res) => {
    const data = new Model({
        title: req.body.title,
        body: req.body.body,
        comments: req.body.comments
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})
// Get All 
router.get('/getAll', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;

// Get by article id 
router.get('/getone/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

// delete 
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// edit article
router.patch('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

////////////////////////////////////comment routes////////////////////////
 
//  add comment 
router.post('/article/:id/addComment', async (req, res) => {
    try{
        const data = await Model.findOneAndUpdate(
            req.params.id , 
            { $push: { "comments" : {
                content:  req.body.content,
                username: req.body.username,
            }  } },
            {safe: true, upsert: true, new : true},
           
            );
            res.json(data);
            }
            catch(error){
                res.status(500).json({message: error.message})
            }
}) 

// get all comment for one post
router.get('/article/:id/comments', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id).select({ comments: 1 });
        
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
// delete comment
router.delete('/comment/:id/:comment', async (req, res) => {
    try{
        const data = await Model.updateOne(
            {_id: req.params.id}
            , {
            $pull: {
              "comments": {_id: req.params.comment},
            },
          });
          res.send(`Document deleted..`);
            }
            catch(error){
                res.status(500).json({message: error.message})
            }
}) 
// edit comment
router.patch('/comment/:id/:comment', async (req, res) => {
    try{
        const data = await Model.updateOne(
            {_id: req.params.id}
            , {
            $set: {
              "comments": {
                content:  req.body.content,
                username: req.body.username,
              },
            },
          });
          res.send(`Document updated..`);
            }
            catch(error){
                res.status(500).json({message: error.message})
            }
}) 
//////////////////////////////////////user routes///////////////////
const userModel = require('../models/User');
// add user 
router.post('/adduser', async (req, res) => {
    const data = new  userModel ({
        username: req.body.username,
        dob: req.body.dob,
        isSuspended: req.body.isSuspended
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//get all users
router.get('/getAllUsers', async (req, res) => {
    try{
        const data = await userModel.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//get one user
router.get('/getOneUser/:id', async (req, res) => {
    try{
        const data = await userModel.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

// delete user
userrouter.delete('/deleteUser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// update user
router.patch('/updateUser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await usergitModel.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Suspended user 
userrouter.post('/user/suspend/:id', async (req, res) => {
    try{
        const data = await Model.findOneAndUpdate(
            req.params.id , 
            { $set: { "isSuspended": req.body.isSuspended  } },
            {safe: true, upsert: true, new : true},
           
            );
            res.json(data);
            }
            catch(error){
                res.status(500).json({message: error.message})
            }
})

//un Suspend user
userrouter.post('/user/unsuspend/:id', async (req, res) => {
    try{
        const data = await Model.findOneAndUpdate(
            req.params.id , 
            { $set: { "isSuspended": false } },
            {safe: true, upsert: true, new : true},
           
            );
            res.json(data);
            }
            catch(error){
                res.status(500).json({message: error.message})
            }
})

//////////////HATEOAS  routes///////////
router.get('/', (req, res) => {
    res.json([{
        "description": "get all articles url",
        "links": [
          {
            "href": "/getAll",
            "rel": "articles",
            "type": "GET"
          }
        ]
    },
    {
        "description": "get specific article url",
        "links": [
          {
            "href": "/api/getone/:id",
            "rel": "articles",
            "type": "GET"
          }
        ]
    },
    {
        "description": "add article url",
        "links": [
          {
            "href": "/api/article",
            "rel": "articles",
            "type": "POST"
          }
        ]
    },
    {
        "description": "Update specific article",
        "links": [
          {
            "href": "/api/edit/:id",
            "rel": "articles",
            "type": "PATCH"
          }
        ]
    },
    {
        "description": "Delete specific article",
        "links": [
          {
            "href": "/api/delete/:id",
            "rel": "articles",
            "type": "DELETE"
          }
        ]
    },
    {
        "description": "Get all comments of specific article",
        "links": [
          {
            "href": "/api/article/:id/comments",
            "rel": "articles,comments",
            "type": "GET"
          }
        ]
    },
    {
        "description": "Add comment to specific article",
        "links": [
          {
            "href": "/api/article/:id/addComment",
            "rel": "comments",
            "type": "POST"
          }
        ]
    },
    {
        "description": "Update specific comment",
        "links": [
          {
            "href": "/api/comment/:id/:comment",
            "rel": "comments",
            "type": "PATCH"
          }
        ]
    },
    {
        "description": "Delete specific comment",
        "links": [
          {
            "href": "/api/comment/:id/:comment",
            "rel": "comments",
            "type": "DELETE"
          }
        ]
    },
    {
        "description": "Get all users url",
        "links": [
          {
            "href": "/api/getAllUsers",
            "rel": "users",
            "type": "GET"
          }
        ]
    },
    {
        "description": "get one user url",
        "links": [
          {
            "href": "/api/getOneUser/:id",
            "rel": "users",
            "type": "GET"
          }
        ]
    },
    {
        "description": "add user url",
        "links": [
          {
            "href": "/api/adduser",
            "rel": "users",
            "type": "POST"
          }
        ]
    },
    {
        "description": "Update specific user",
        "links": [
          {
            "href": "/api/updateUser/:id",
            "rel": "users",
            "type": "PATCH"
          }
        ]
    },
    {
        "description": "Delete specific user",
        "links": [
          {
            "href": "/api/deleteUser/:id",
            "rel": "users",
            "type": "DELETE"
          }
        ]
    },
    {
        "description": "suspend specific user",
        "links": [
          {
            "href": "/api/user/suspend/:id",
            "rel": "users",
            "type": "POST"
          }
        ]
    }
    ,{
        "description": "unsuspend specific user",
        "links": [
          {
            "href": "/api/user/unsuspend/:id",
            "rel": "users",
            "type": "POST"
          }
        ]
    }
    
]);
  });
