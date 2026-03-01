// Admin role guard — must be used AFTER the `protect` middleware
export const protectAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required." });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
