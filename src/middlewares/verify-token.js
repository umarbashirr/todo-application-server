import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies["app-token"] || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "You are not authorized to complete this request!",
        success: false,
      });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

    if (!decodedToken) {
      return res.status(400).json({
        message: "Invalid request!",
        success: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
