const ExternalJSContainer = require('../utils/externalJSContainer');
module.exports = (req, res, next) => {

    const pathname = req.url;
    const method = req.method.toLowerCase();

    const externalProcessorPaths = ExternalJSContainer.getInstance().paths;

    const externaleJSPath = externalProcessorPaths.find(path => path.routes.includes(pathname) && path.method == method)?.path;

    if (!externaleJSPath || externaleJSPath == "") {
        next();
        return;
    }

    let externalFunction = require(externaleJSPath);


    //If isIntercepted is true, the request will be handled by the loaded JS file and not be passed to the next middleware
    let { response, isIntercepted } = externalFunction(req, res);

    if (isIntercepted) {
        console.log("Request is intercepted, will be handled by loaded JS file");
        res.send(response);
        return;
    }
    next();
}