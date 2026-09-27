import Note from "../models/note.js";

export async function getNotes(req, res) {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ pinned: -1, date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

export async function getNotesbyId(req, res) {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

export async function postNotes(req, res) {
  try {
    const note = new Note({
      title: req.body.title || "Untitled",
      content: req.body.content !== undefined ? req.body.content : (req.body.body || ""),
      pinned: req.body.pinned !== undefined ? req.body.pinned : false,
      color: req.body.color !== undefined ? req.body.color : 0,
      tilt: req.body.tilt !== undefined ? req.body.tilt : 0,
      date: req.body.date || new Date(),
      user: req.user._id,
    });

    const savedNote = await note.save();

    res.status(201).json({
      message: "You posted notes",
      data: savedNote,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

export async function putNotes(req, res) {
  try {
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.content !== undefined) updateData.content = req.body.content;
    if (req.body.body !== undefined && req.body.content === undefined) updateData.content = req.body.body;
    if (req.body.pinned !== undefined) updateData.pinned = req.body.pinned;
    if (req.body.color !== undefined) updateData.color = req.body.color;
    if (req.body.tilt !== undefined) updateData.tilt = req.body.tilt;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "You updated notes",
      data: updatedNote,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

export async function deleteNotes(req, res) {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}
