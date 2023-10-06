'use strict';

const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const chokidar = require('chokidar');
const EventEmitter = require('events');
const logger = require('lllog')();
const ExternalJSContainer = require('../utils/externalJSContainer')

const OpenAPISchemaNotFound = require('../errors/openapi-schema-not-found-error');
const OpenAPISchemaMalformed = require('../errors/openapi-schema-malformed-error');


module.exports = class CustomSchemaLoader extends EventEmitter {
    load(schemaPath) {
        let customSchema;
        this.schemaPath = path.isAbsolute(schemaPath) ? schemaPath : path.join(process.cwd(), schemaPath);

        try {
            fs.accessSync(this.schemaPath, fs.constants.R_OK);
        } catch (e) {
            throw new OpenAPISchemaNotFound(`Schema not found in ${this.schemaPath}`);
        }

        if (this.schemaPath.match(/\.ya?ml$/)) {
            try {
                customSchema = YAML.load(fs.readFileSync(this.schemaPath));
            } catch (e) {
                throw new OpenAPISchemaMalformed(e.message);
            }
        }

        try {
            customSchema = JSON.parse(fs.readFileSync(this.schemaPath));
        } catch (e) {
            throw new OpenAPISchemaMalformed(e.message);
        }

        if (!customSchema.servers || customSchema.servers.length == 0) throw new OpenAPISchemaMalformed("Servers not specified in schema");

        const routePaths = Object.entries(customSchema.paths);

        for (const [route, methods] of routePaths) {
            for (const [method, methodConfig] of Object.entries(methods)) {
                const externalJSPath = methodConfig["x-external-processor"]?.path;
                if (externalJSPath) {
                    console.log("External Processor loaded for: " + method + " " + route);
                    ExternalJSContainer.getInstance().paths.push({ route: route, method: method, path: externalJSPath });
                }
            }
        }

        return customSchema;
    }

    watch() {
        logger.info('Watching changes...');
        chokidar.watch(this.schemaPath)
            .on('change', () => {
                setTimeout(async () => this.emit('schema-changed'), 100);
            });
    }

};
