import { jest } from "@jest/globals";

const mockDeleteUserById = jest.fn();
const mockUpdateUserById = jest.fn();

jest.unstable_mockModule("../models/userModel.js", () => ({
  deleteUserById: mockDeleteUserById,
  updateUserById: mockUpdateUserById,
}));

const { deleteUser, updateUser } = await import("./userController.js");

describe("deleteUser", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        id: "1",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("should delete user successfully", async () => {
    mockDeleteUserById.mockResolvedValue();

    await deleteUser(req, res);

    expect(mockDeleteUserById).toHaveBeenCalledWith("1");

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User deleted successfully",
    });
  });

  test("should return 500 when delete fails", async () => {
    mockDeleteUserById.mockRejectedValue(new Error("Database error"));

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });
});

describe("updateUser", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        id: "1",
      },
      body: {
        username: "newUsername",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("should update user successfully", async () => {
    mockUpdateUserById.mockResolvedValue();

    await updateUser(req, res);

    expect(mockUpdateUserById).toHaveBeenCalledWith("1", {
      username: "newUsername",
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "User updated successfully",
    });
  });

  test("should return 400 when body is empty", async () => {
    req.body = {};

    await updateUser(req, res);

    expect(mockUpdateUserById).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "No fields to update",
    });
  });

  test("should return 500 when update fails", async () => {
    mockUpdateUserById.mockRejectedValue(new Error("Database error"));

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});