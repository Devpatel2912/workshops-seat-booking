
import { auth } from "../auth/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { AccessDeniedError } from "../common/error/ApiError.js";

export const authenticate = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    next(error);
  }
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      throw new AccessDeniedError("You have not permistion!")
    }

    next();
  };
};
