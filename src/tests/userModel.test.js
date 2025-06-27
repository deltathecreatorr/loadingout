//This file contains tests for creating the user model and checking it's properties.

import User from "../models/userModel.js";

test("User model should have the correct properties", () => {
  const user = new User({
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  });

  expect(user.username).toBe("testuser");
  expect(user.email).toBe("test@example.com");
  expect(user.password).toBe("password123");
  expect(user.isVerified).toBe(false);
  expect(user.isAdmin).toBe(false);
  expect(user.forgotPasswordToken).toBeUndefined();
  expect(user.forgotPasswordTokenExpiry).toBeUndefined();
  expect(user.verifyToken).toBeUndefined();
  expect(user.verifyTokenExpiry).toBeUndefined();
});

test("User model should require username, email, and password", async () => {
  const user = new User({});
  let err;
  try {
    await user.validate();
  } catch (error) {
    err = error;
  }
  expect(err.errors.username).toBeDefined();
  expect(err.errors.email).toBeDefined();
  expect(err.errors.password).toBeDefined();
});

test("User model should enforce minlength for username and password", async () => {
  const user = new User({
    username: "abc",
    email: "test@example.com",
    password: "123",
  });
  let err;
  try {
    await user.validate();
  } catch (error) {
    err = error;
  }
  expect(err.errors.username).toBeDefined();
  expect(err.errors.password).toBeDefined();
});

test("User model should have unique constraints on username and email", () => {
  const schema = User.schema;
  expect(schema.path("username").options.unique).toBe(true);
  expect(schema.path("email").options.unique).toBe(true);
});

test("User model should set default values for isVerified and isAdmin", () => {
  const user = new User({
    username: "testuser2",
    email: "test2@example.com",
    password: "password123",
  });
  expect(user.isVerified).toBe(false);
  expect(user.isAdmin).toBe(false);
});
