import express from "express";

const router = express.Router();
import { generateSDKSignature, getHostZAKToken, getMeetingDetails } from "../controllers/zoomControllers";

router.route("/").get();

// Get MSDK Signature Route
router.route("/msig").post(generateSDKSignature);

// Get ZAK token Of Meeting Host
router.route("/hzak").get(getHostZAKToken);

// Get Meeting Details for Meeting Host
router.route("/mnum").get(getMeetingDetails);

export default router; // Export the router so it can be used in server.js
