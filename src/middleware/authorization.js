import ErrorClass from "../utils/Error-class.js";


export const authorizationMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
      
      const user = req.user;
    
      if (!allowedRoles.includes(user.role)) {
        return next(
          new ErrorClass(
            "Authorization Error",
            401,
            "You are not allowed to access this route"
          )
        );
      }
      next();
    };
  };