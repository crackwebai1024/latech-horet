import errorHandler from "../../helpers/dbErrorHandler";
import Note from "../../models/notes/note.model";

const getNotes = async (req, res) => {
  if (!req.params.id) {
    try {
      let notes = await Note.find({});
      return res.status(200).json({
        notes,
      });
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  } else {
    try {
      const note = await Note.findOne({ _id: req.params.id });
      return res.status(200).json({
        note,
      });
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  }
};

const createNote = async (req, res) => {
  const element = new Note({
    title: req.body.title,
    content: req.body.content,
    user_id: req.auth._id,
  });
  try {
    await element.save();
    return res.status(200).json({
      message: "Successfully created!",
      note: {
        title: element.title,
        content: element.content,
        noteId: element.id,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const updateNote = async (req, res) => {
  try {
    let note = await Note.findOne({ _id: req.params.id });
    note.title = req.body.title;
    note.content = req.body.content;

    await note.save();
    return res.status(200).json(note);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      message: "Successfully deleted!",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { getNotes, createNote, updateNote, deleteNote };
