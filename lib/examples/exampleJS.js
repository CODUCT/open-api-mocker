module.exports = (validationPackage) => {
    let isIntercepted = true;


    // Code that gets executed when request is received belongs here
    // Response can look like this:

    let response = {
        "status": "ok",
        "message": "This is a mocked response",
        "data": validationPackage.body
    }


    return { response, isIntercepted }
};