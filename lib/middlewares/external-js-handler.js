const ExternalJSContainer = require('../utils/externalJSContainer');
class ExternalHandler {
    execute = (validationPackage) => {
        const pathname = validationPackage.uri;
        const method = validationPackage.httpMethod.toLowerCase();

        const externalProcessorPaths = ExternalJSContainer.getInstance().paths;

        const externaleJSPath = externalProcessorPaths.find(e => e.route == pathname && e.method == method)?.path;

        if (!externaleJSPath || externaleJSPath == "") {
            //next();
            return;
        }

        let externalFunction = require(externaleJSPath);


        //If isIntercepted is true, the request will be handled by the loaded JS file and not be passed to the next middleware
        let { response, isIntercepted } = externalFunction(validationPackage);

        if (isIntercepted) {
            console.log("Request is intercepted, will be handled by loaded JS file");
        }
        return { response, isIntercepted };
    }
}

module.exports = new ExternalHandler();