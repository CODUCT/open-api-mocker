const ExternalJSContainer = require('../utils/externalJSContainer');
module.exports = (req, res, next) => {
    let path = ExternalJSContainer.getInstance().path;
    
    if (!path || path == "") {
        return;
    }
    
    require(path)();
    next();
}