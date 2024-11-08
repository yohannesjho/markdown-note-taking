const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const { marked } = require('marked')
const multer = require('multer')
const upload = require('../config/fileConfig')

//create a new note
router.post('/note', async (req, res) => {
    const { title, content } = req.body
    try {

        const note = new Note({
            title,
            content
        })
        const savedNote = await note.save()
        res.status(201).json(savedNote)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//get rendered markdown from html
router.get('/note/render/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
        if (!note) { res.status(404).json({ message: "note not found" }) }
        const html = marked(note.content)
        res.status(200).json({ html })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//get note by id
router.get('/note/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
        if (!note) { res.status(404).json({ message: "note not found" }) }
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//file uploades 
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        console.log(req.file); // Logs the file info to the console
        res.send('File uploaded successfully!');
    } catch (err) {
        res.status(400).send('Error uploading file');
    }
});

module.exports = router;