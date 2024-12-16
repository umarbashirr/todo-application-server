import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { loginFormSchema, registerFormSchema } from "../schemas/auth.schema.js";

export const registerUser = async (req, res) => {
  try {
    const fields = registerFormSchema.safeParse(req.body);

    if (!fields.success) {
      return res
        .status(400)
        .json({ message: fields.error.flatten().fieldErrors, success: false });
    }

    const { name, email, password } = fields.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already in use!", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "user created!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const loginUser = async (req, res) => {
  try {
    const fields = loginFormSchema.safeParse(req.body);

    if (!fields.success) {
      return res
        .status(400)
        .json({ message: fields.error.flatten().fieldErrors, success: false });
    }

    const { email, password } = fields.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "user not found!", success: false });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ message: "Invalid password!", success: false });
    }

    const token = await jwt.sign(
      { id: existingUser.id },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("app-token", token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "User Logged In", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
