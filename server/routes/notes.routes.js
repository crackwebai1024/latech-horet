import express from "express";
import { requireSignin, hasAuthorization } from "../controllers/auth/auth";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notes/notes";

const router = express.Router();

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
