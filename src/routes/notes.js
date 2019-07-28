const express = require('express');
const router = express.Router();

const Note = require('../model/Notes');
const { isAuthenticated } = require('../helpers/auth');


router.get('/notes/add', isAuthenticated, (req, res) =>{
    res.render('notes/new-notes')
})

router.post('/notes/new-note', isAuthenticated, async (req, res) =>{
    const { titulo, descripcion } = req.body;
    const errors = [];

    if(!titulo){
        errors.push({text: 'Please Write a Title'})
    }
    if(!descripcion){
        errors.push({text: 'Please Write a Description'})
    }
    if(errors.length > 0) {
        res.render('notes/new-notes', {
            errors,
            titulo, 
            descripcion
        })
    } else {
        const newNotes = new Note({titulo, descripcion});
        newNotes.user = req.user.id;
        await newNotes.save();
        req.flash('success_msg', 'Note add SuccessFull');
        res.redirect('/notes');
    } 
})

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id }).sort({date: 'desc'});
    res.render('notes/all-notes', { notes })
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) =>{
    const note = await Note.findById(req.params.id)
    console.log(note);
    
    res.render('notes/edit-notes', { note })
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { titulo, descripcion} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {titulo, descripcion })
    req.flash('success_msg', 'Note Update Successfully');
    res.redirect('/notes');
})

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndRemove(req.params.id);
    req.flash('success_msg', 'Note Delete Successfully');
    res.redirect('/notes');
})

module.exports = router;