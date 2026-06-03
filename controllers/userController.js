import { deleteUserById } from "../models/userModel.js";


export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    await deleteUserById(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export default deleteUser;
