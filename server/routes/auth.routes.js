import express from "express";
import {
  signIn,
  signOut,
  create,
  requireSignin,
  hasAuthorization,
} from "../controllers/auth/auth";

const router = express.Router();

router.route("/signin").post(signIn);
router.route("/signup").post(create, signIn);
router.route("/signOut").post(requireSignin, hasAuthorization, signOut);

export default router;
