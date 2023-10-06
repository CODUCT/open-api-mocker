'use strict';

const Ajv = require('ajv');
const openApi = require('ajv-openapi');

// Configuration as defined in ajv-openapi example: https://www.npmjs.com/package/ajv-openapi#configuration-for-full-openapi-compatibility
const ajvOptions = {
	schemaId: 'auto',
	format: 'full',
	coerceTypes: true,
	unknownFormats: 'ignore',
	useDefaults: true
};

const openApiOptions = {
	useDraft04: true
};

const ajv = openApi(
	new Ajv(ajvOptions),
	openApiOptions
);

class SchemaValidator {
	static validate(data, schema) {

		let validation = !ajv.validate(schema, data) ? ajv.errors : [];
		console.log("Validation");
		console.log(data);
		if (validation.length == 0) {

		}
		return validation;
	}
}

module.exports = SchemaValidator;
