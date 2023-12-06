const ExternalJSContainer = require('../utils/externalJSContainer');
const util = require('util')
class ExternalHandler {
    execute = (validationPackage) => {
        console.log("Request of mocked route")
        console.log(util.inspect(validationPackage, { showHidden: false, depth: null, colors: true }))
        const pathname = validationPackage.uri;
        const method = validationPackage.httpMethod.toLowerCase();

        const externalProcessorPaths = ExternalJSContainer.getInstance().paths;

        const externalJSPath = externalProcessorPaths.find(e => e.route == pathname && e.method == method)?.path;

        if (!externalJSPath || externalJSPath == "") {
            //next();
            return;
        }

        let externalFunction = require(externalJSPath);


        //If isIntercepted is true, the request will be handled by the loaded JS file and not be passed to the next middleware
        let { response, isIntercepted, statusCode } = externalFunction(validationPackage);

        if (isIntercepted) {
            console.log("Request is intercepted, will be handled by loaded JS file");
        }
        return { response, isIntercepted };
    }

    executeToplevel = (req) => {
        console.log("Request body")
        console.log(util.inspect(req.body, { showHidden: false, depth: null, colors: true }))
        const externalProcessorPaths = ExternalJSContainer.getInstance().topLevelPaths;

        const externalJSPath = externalProcessorPaths.find(e => {
            return req.originalUrl.startsWith(e.server);
        })?.path;

        if (!externalJSPath || externalJSPath == "") {
            //next();
            return;
        }

        let externalFunction = require(externalJSPath);


        //If isIntercepted is true, the request will be handled by the loaded JS file and not be passed to the next middleware
        let { response, isIntercepted, statusCode } = externalFunction(req);

        if (isIntercepted) {
            console.log("Request is intercepted, will be handled by loaded JS file");
        }
        return { response, isIntercepted };
    }
}

module.exports = new ExternalHandler();