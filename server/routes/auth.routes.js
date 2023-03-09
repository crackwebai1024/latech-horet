import express from "express";
import authCtrl from "../controllers/auth/auth";

const router = express.Router();
const { signIn, signOut, create, requireSignin, hasAuthorization } = authCtrl;

router.route("/signin").post(signIn);
router.route("/signup").post(create, signIn);
router.route("/signOut").post(requireSignin, hasAuthorization, signOut);

export default router;
