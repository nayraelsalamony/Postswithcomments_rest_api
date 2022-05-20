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