const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { email, userid } = req.body;
    const { data, error } = await supabase
      .from("users")
      .insert({ email: email, authid: userid })
      .select();
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: JSON.stringify(error),
      });
    }
    console.log(data);
    res.status(200).json({
      message: "Signup successful! Please check your email for confirmation.",
      user: { email: data[0].email, id: data[0].authid },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // Store user session in Express session
    req.session.user = data.user;
    req.session.accessToken = data.session.access_token;
    res.status(200).json({
      message: "Signin successful!",
      user: data.user,
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
});

// Sign Out
router.post("/signout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    req.session.destroy();
    res.status(200).json({
      message: "Signout successful!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Password Reset Request
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.SITE_URL}/reset-password-confirm`,
    });

    if (error) throw error;

    res.status(200).json({
      message: "Password reset email sent!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
// Get Current User
router.get("/user", async (req, res) => {
  try {
    // Check if user is in session
    if (!req.session.user) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }
    // Get user data from User table
    const { data, error } = await supabase.auth.getUser(
      req.session.accessToken
    );
    if (error) throw error;
    res.status(200).json({
      user: data.user,
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
});
// Set session from client after OAuth redirect
router.post("/set-session", async (req, res) => {
  try {
    const { user, accessToken } = req.body;
    if (!user) {
      return res.status(400).json({
        error: "Invalid request",
      });
    }
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    // Set session
    req.session.user = {
      userid: data.user.id,
      email: data.user.email,
    };
    res.status(200).json({
      message: "Session created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
