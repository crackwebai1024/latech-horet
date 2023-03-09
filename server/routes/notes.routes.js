import express from "express";
import authCtrl from "../controllers/auth/auth";
import NoteCtrl from "../controllers/notes/notes";

const router = express.Router();
const { requireSignin, hasAuthorization } = authCtrl;
const { getNotes, createNote, updateNote, deleteNote } = NoteCtrl;

router
  .route("")
  .get(requireSignin, hasAuthorization, getNotes)
  .post(requireSignin, hasAuthorization, createNote);

router
  .route("/:id")
  .get(requireSignin, hasAuthorization, getNotes)
  .put(requireSignin, hasAuthorization, updateNote)
  .delete(requireSignin, hasAuthorization, deleteNote);

export default router;
