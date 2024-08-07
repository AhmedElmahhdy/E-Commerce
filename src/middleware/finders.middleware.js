import ErrorClass from "../utils/Error-class.js";



export const cheackId = (model) => {
    return async (req, res, next) => {
        const { id } = req.params;
        const doc = await model.findById(id);
        if (!doc) return next(new ErrorClass("Document not found", 404));
        req.doc = doc;
        next();
    };
}