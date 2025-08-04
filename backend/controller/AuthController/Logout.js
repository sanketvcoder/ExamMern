// controller/AuthController/logout.js

const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.status(200).json({ message: "Logged out successfully." });
    
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error during logout." });
  }
};

export default logout;
