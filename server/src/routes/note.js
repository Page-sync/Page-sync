const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const { authenticateUser } = require("../middleware/auth");
// open to all
router.get("/note", async (req, res) => {
  try {
    const { data, error } = await supabase.from("note").select();
    // future: only select public ones
    if (error) throw error;
    res.status(200).json({
      message: "Create new note successful.",
      note: {},
      annotation: {},
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
//need auth:
// future: make note editable or not from backend, prevent user from editing others'notes
// create new note
router.post("/note", authenticateUser, async (req, res) => {
  try {
    // note: title, content, page, isbn, no note.id
    const { user, note } = req.body;
    // insert note into note table
    const { noteData, noteError } = await supabase
      .from("note")
      .upsert({ content: note.content, title: note.title?.note.title })
      .select("id");
    // insert into annotation
    const { annotationData, annotationError } = await supabase
      .from("annotation")
      .insert({
        noteid: noteData[0].id,
        userid: user.id,
        isbn: note.isbn,
        page: note.page,
      });
    if (noteError) throw noteError;
    if (annotationError) throw annotationError;
    res.status(200).json({
      message: "Create new note successful.",
    });
    // in frontend: refresh and call get all notes again
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// edit note
router.patch("/note", authenticateUser, async (req, res) => {
  try {
    // note: title, content, page, isbn, note.id
    const { user, note } = req.body;
    const { data, error } = await supabase
      .from("note")
      .update({
        content: note.content,
        //TODO: if note.title exist, update title, else: keep original title
      })
      .eq("id", note.id);
    if (error) throw error;
    res.status(200).json({
      message: "Update successful.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// delete note
router.delete("/note", authenticateUser, async (req, res) => {
  try {
    const { user, note } = req.body;
    const { data, error } = await supabase
      .from("note")
      .delete()
      .eq("id", note.id);
    if (error) throw error;
    res.status(200).json({
      message: "Delete successful!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
