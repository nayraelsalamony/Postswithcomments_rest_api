const express = require('express');
const Model = require('../models/Article');
const router = express.Router();
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