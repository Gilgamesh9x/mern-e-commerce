import {
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export function authenticateUser(req, res, next) {
  const { auth } = req.cookies;
  if (!auth) throw new UnauthenticatedError("Invalid Authentication");

  const { userId, role, fullName } = verifyJWT(auth);

  req.user = { userId, role, fullName };

  next();
}

export function authorizePermissions(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unautorized to access this route.");
    }
    next();
  };
}
