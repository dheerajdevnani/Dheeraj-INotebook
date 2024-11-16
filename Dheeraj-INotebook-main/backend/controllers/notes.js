const Notes = require("../models/Notes");
const ExpressError = require("../utils/ExpressError");

module.exports.fetchAllNotes = async (req, res, next) => {
    try {
        const { id } = req.user;
        const notes = await Notes.find({ user: id });
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

module.exports.addNote = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { title, description, tag } = req.body;
        const note = new Notes({ title, description, tag, user: id });
        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        next(error);
    }
};

module.exports.updateNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const note = await Notes.findById(id);
        if (!note) {
            throw new ExpressError("Note not found", 404);
        }
        if (note.user.toString() !== userId) {
            throw new ExpressError("Unauthorized access", 401);
        }
        const updatedNote = await Notes.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};

module.exports.deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const note = await Notes.findById(id);
        if (!note) {
            throw new ExpressError("Note not found", 404);
        }
        if (note.user.toString() !== userId) {
            throw new ExpressError("Unauthorized access", 401);
        }
        const deletedNote = await Notes.findByIdAndDelete(id);
        res.status(200).json({ message: `${deletedNote.title} deleted successfully`, note: deletedNote });
    } catch (error) {
        next(error);
    }
};
