import express from "express";
import { getNotes, postNotes, putNotes, deleteNotes, getNotesbyId } from "../controllers/notescontroller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All note routes require authentication
router.use(protect);

router.get("/", getNotes);

router.get("/:id", getNotesbyId);

router.post("/", postNotes);

router.put("/:id", putNotes);

router.delete("/:id", deleteNotes);

export default router;
