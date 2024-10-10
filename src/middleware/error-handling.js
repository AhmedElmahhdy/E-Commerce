  import deleteFile from "../utils/delete-file.js";
  import ErrorClass from "../utils/Error-class.js";


  export const errorHandler = (API) => {
    return (req, res, next) => {
      API(req, res, next).catch((err) => { 
        if (req.file?.path) {
          deleteFile(req.file.path, req.model);
        }

        if(req.files?.length)
          for (const file of req.files) {
              deleteFile(file.path, req.model)
          }
        next(new ErrorClass(err.message, 500 ));
      });
    };
  };

export const globalResponse = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      error: "Faill Response",
      message: err.message,
      err : err?.error,
      stack: err.stack,
    });
  }
};
