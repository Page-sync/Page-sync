const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const { authenticateUser } = require("../middleware/auth");
// open to all
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("note").select(`
    *,
    annotation:annotation(noteid,userid:users(authid),isbn,page)
  `);
    // TODO-future: only select public ones
    if (error) throw error;
    res.status(200).json({
      message: "Create new note successful.",
      note: data,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
// TODO-future: confirm note editable or not from backend, prevent user from editing others'notes
// create new note
router.post("/", authenticateUser, async (req, res) => {
  try {
    // note: title, content, page, isbn, no note.id
    const { user, note } = req.body;
    const upsertData = {
      content: note.content,
    };
    if (note.title !== undefined && note.title !== null) {
      upsertData.title = note.title;
    }
    // insert note into note table
    const { noteData, noteError } = await supabase
      .from("note")
      .upsert(upsertData)
      .select("id");
    if (noteError) throw noteError;
    // get user primary key
    const { userData, userError } = await supabase
      .from("users")
      .select("id", user.id)
      .eq("authid", user.id);
    if (userError) throw userError;
    // insert into annotation
    const { annotationData, annotationError } = await supabase
      .from("annotation")
      .insert({
        noteid: noteData[0].id,
        userid: userData[0].id,
        isbn: note.isbn,
        page: note.page,
      });
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
router.patch("/", authenticateUser, async (req, res) => {
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
router.delete("/", authenticateUser, async (req, res) => {
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
