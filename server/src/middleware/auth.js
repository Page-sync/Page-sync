const supabase = require("../supabaseClient");

const authenticateUser = async (req, res, next) => {
  try {
    // Check if user session exists
    if (!req.session.user || !req.session.accessToken) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }
    // Verify token is still valid
    const { data, error } = await supabase.auth.getUser(
      req.session.accessToken
    );
    if (error || !data.user) {
      req.session.destroy();
      return res.status(401).json({
        error: "Session expired",
      });
    }
    // add user info to req if exists
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};

module.exports = { authenticateUser };
