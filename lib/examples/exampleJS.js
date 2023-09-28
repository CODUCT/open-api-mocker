module.exports = (req, res) => {
    let isIntercepted = true;


    // Code that gets executed when request is received belongs here
    // Response can look like this:

    let response = {
        "status": "ok",
        "message": "This is a mocked response",
        "data": req.body
    }


    return { response, isIntercepted }
};