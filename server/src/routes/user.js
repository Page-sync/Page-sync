const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const { authenticateUser } = require("../middleware/auth");
router.use(authenticateUser);

// get user's all reading historys
router.get("/history", async (req, res) => {
  try {
    const { user } = req.user;
    const { userData, userError } = await supabase
      .from("users")
      .select("id")
      .eq("authid", user.id);
    if (userError) throw userError;
    const { data, error } = await supabase
      .from("history")
      .select()
      .eq("userid", userData[0].id);
    if (error) throw error;
    res.status(200).json({
      message: "Create new note successful.",
      history: data.map((history) => {
        return { isbn: history.isbn, page: history.page, id: history.id };
      }),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
// create new history
router.post("/history", async (req, res) => {
  try {
    // note: title, content, page, isbn, no note.id
    const { user, history } = req.body;
    const { userData, userError } = await supabase
      .from("users")
      .select("id")
      .eq("authid", user.id);
    if (userError) throw userError;
    // insert note into note table
    const { data, error } = await supabase
      .from("history")
      .insert({
        userid: userData[0].id,
        isbn: history.isbn,
        page: history.page,
      })
      .select("id");

    if (error) throw error;
    res.status(200).json({
      message: "Create new history successful.",
    });
    // in frontend: refresh and call get all history again
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// update history
router.patch("/history", async (req, res) => {
  try {
    // is a user already have history to a book, update the page instead of creating a new history
    // note: title, content, page, isbn, note.id
    const { user, history } = req.body;

    const { data, error } = await supabase
      .from("history")
      .update({
        page: history.page,
        update_at: new Date().toISOString(),
      })
      .eq("id", history.id);
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

// delete history
router.delete("/history", authenticateUser, async (req, res) => {
  try {
    const { user, history } = req.body;
    const { data, error } = await supabase
      .from("history")
      .delete()
      .eq("id", history.id);
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
