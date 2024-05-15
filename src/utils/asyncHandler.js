const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}


/*
// const asyncHandler = (fnc) => { async () => {} }
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(res, req, next);
    } catch (error) {
        res.status(res.code || 500).json({
            success: false,
            message: err.message
        });
    }
}
*/