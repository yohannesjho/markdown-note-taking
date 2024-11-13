const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const { marked } = require('marked')
const multer = require('multer')
const upload = require('../config/fileConfig')
const axios = require('axios')
const { getDb } = require('../db/db')
const { ReturnDocument } = require('mongodb')


//create a new note
router.post('/note', async (req, res) => {
    const { title, content } = req.body;
    try {
        const db = getDb();
        const result = await db.collection('notes').insertOne({ title, content, createdAt: Date.now() });
        res.status(201).json({ message: "Document inserted", noteId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get rendered markdown from html
router.get('/note/render/:id', async (req, res) => {
    try {
        const db = getDb();
        const note = await db.collection("notes").findOne({ _id: req.params.id })
        if (!note) return res.status(404).json({ message: "Note not found" });
        const html = marked(note.content);
        res.status(200).json({ html });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//get all notes
router.get('/notes', async (req, res) => {
    try {
        const db = getDb()
        const notes = await db.collection('notes').find().toArray()
        res.status(200).json(notes)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//get note by id
router.get('/note/:id', async (req, res) => {
    try {
        const db = getDb()
        const note = await db.collection('notes').findOne({ _id: new require("mongodb").ObjectId(req.params.id) })
        if (!note) return res.status(404).json({ message: "note not found" })
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//update a specific note
router.put('/note/:id', async (req, res) => {
    const { title, content } = req.body
    try {
        const db = getDb()
        await db.collection("notes").updateOne(
            { _id: new require("mongodb").ObjectId(req.params.id) },
            {
                $set: {
                    title,
                    content,
                    updatedAt: new Date.now()
                }
            },
            { returnDocument: 'after' })
        res.status(200).json(updatedNote)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete a specific note
router.delete('/note/:id', async (req, res) => {
    try {
      const db = getDb()
      const result = await db.collection("notes").deleteOne({_id:new require("mongodb").ObjectId(req.params.id)})
      if(result.deletedCount === 0) return res.status(404).json({message:"note not found"})
      res.status(200).json({message:"note deleted successfully"})
    } catch (error) {
        res.status(500).json({ messsage: error.message })
    }
})

//file uploades 
router.post('/note/:id/upload', upload.single('file'), async (req, res) => {
    try {
        const db = getDb()
        const note = await db.collection("notes").findOne({ _id: new require('mongodb').ObjectId(req.params.id) })
        if (!note) return res.status(404).json({ message: "Note not found" });
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        await db.collection('notes').updateOne(
            { _id: new require('mongodb').ObjectId(req.params.id) },
            { $push: { files: req.file.path } }
           
            res.status(200).json({ message: "File uploaded successfully", filePath: req.file.path });
            

        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//check the grammar
router.post('/grammar-check', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Text is required' });
    }

    try {
        // LanguageTool API request
        const response = await axios.post('https://api.languagetool.org/v2/check', {
            text: text,
            language: 'auto'
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (response.data.matches.length === 0) {
            res.status(400).json({ message: "there is no grammar error" })
        }
        res.status(200).json(response.data.matches[0].message);
    } catch (error) {
        console.error('Grammar check error:', error);
        res.status(500).json({ message: 'Error checking grammar', error: error.message });
    }
})

module.exports = router;