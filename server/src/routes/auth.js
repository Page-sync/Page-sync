const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // belike: knex.insert, but insert to a special user table
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    // insert user into DB
    const { dbData, dbError } = await supabase
      .from("user")
      .insert({ email: email, name: username, authid: data.user.id })
      .select();
    if (dbError) throw dbError;
    res.status(200).json({
      message: "Signup successful! Please check your email for confirmation.",
      user: { emailL: email, username: username, id: data.user.id },
    });
  } catch (error) {
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

    // Clear the session
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
router.post("/set-session", (req, res) => {
  try {
    const { user, accessToken } = req.body;
    if (!user || !accessToken) {
      return res.status(400).json({
        error: "Invalid request",
      });
    }
    // Set session
    req.session.user = user;
    req.session.accessToken = accessToken;
    res.status(200).json({
      message: "Session created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
