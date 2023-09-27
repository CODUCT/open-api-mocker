const ExternalJSContainer = require('../utils/externalJSContainer');
module.exports = (req, res, next) => {
    let path = ExternalJSContainer.getInstance().path;

    if (!path || path == "") {
        return;
    }

    let externalFunction = require(path);


    // If isIntercepted is true, the request will be handled by the loaded JS file and not be passed to the next middleware
    let { response, isIntercepted } = externalFunction(req, res);

    if (isIntercepted) {
        console.log("Request is intercepted, will be handled by loaded JS file");
        res.send(response);
        return;
    }
    next();
}