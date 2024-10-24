# OpenAPI Mocker

![Build Status](https://github.com/jormaechea/open-api-mocker/workflows/build/badge.svg)
[![npm version](https://badge.fury.io/js/open-api-mocker.svg)](https://www.npmjs.com/package/open-api-mocker)
[![Maintainability](https://api.codeclimate.com/v1/badges/79f6eca7ea3f8fe554c2/maintainability)](https://codeclimate.com/github/jormaechea/open-api-mocker/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/79f6eca7ea3f8fe554c2/test_coverage)](https://codeclimate.com/github/jormaechea/open-api-mocker/test_coverage)
[![Docker compatible](https://img.shields.io/badge/docker-compatible-green)](https://hub.docker.com/repository/docker/jormaechea/open-api-mocker)

An API mocker based in the OpenAPI 3.0 specification.

## Installation and usage

### Using npm

```
npm install -g @coductsolutions/open-api-mocker

open-api-mocker -s my-schema.json -w

open-api-mocker --help # To prompt every available setting.
```

## Capabilities

- [x] Read yaml and json OpenAPI v3 schemas.
- [x] Port binding selection
- [x] Request parameters validation
- [x] Request body validation
- [x] Response body and headers generation based on examples or schemas
- [x] Response selection using request header: `Prefer: statusCode=XXX` or `Prefer: example=name`
- [x] Request and response logging
- [x] Servers basepath support
- [x] Support x-faker and x-count extension methods to customise generated responses
- [ ] API Authentication

## Customizing Generated Responses
The OpenAPI specification allows custom properties to be added to an API definition in the form of _x-*_.
OpenAPI Mocker supports the use of two custom extensions to allow data to be randomised which should allow for more
realistic looking data when developing a UI against a mock API for instance.

### x-faker
The _x-faker_ extension is valid for use on properties that have a primitive type (e.g. `string`/`integer`, etc.)
and can be used within an API definition to use one or more methods from the community mantained
[Faker](https://fakerjs.dev/) library for generating random data.

Given the following API definition:
```yaml
openapi: '3.0.2'
info:
  title: Cats
  version: '1.0'
servers:
  - url: https://api.cats.test/v1
paths:
  /cat:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  firstName:
                    type: string
                    x-faker: person.firstName
                  lastName:
                    type: string
                    x-faker: person.lastName
                  fullName:
                    type: string
                    x-faker: '{{person.firstName}} {{person.lastName}}'
                  age:
                    type: string
                    x-faker: 'number.int({ "min": 1, "max": 20 })'

```

A JSON response similar to the following would be produced:
```JSON
{
    "firstName": "Ted",
    "lastName": "Kozey",
    "fullName": "Herbert Lowe",
    "age": 12
}
```

The _x-faker_ extension accepts values in 3 forms:
1. _fakerNamespace.method_. e.g. `string.uuid`
2. _fakerNamespace.method({ "methodArgs": "in", "json": "format" })_. e.g. `number.int({ "max": 100 })`
3. A mustache template string making use of the 2 forms above. e.g. `My name is {{person.firstName}} {{person.lastName}}`

*NOTE*: To avoid new fake data from being generated on every call, up to 10 responses per endpoint are cached
based on the incoming query string, request body and headers.

### x-external-processor

With the _x-external-processor_ extension, you can specify a command to be executed and if specified intercept the response with the output of the command.

The _x-external-processor_ will be read from the route definition inside the OpenAPI schema like so:

```json
    "paths": {
      "/books": {
        "get": {
          "summary": "Get a list of books",
          "responses": {
            "200": {
              "description": "List of books retrieved successfully",
              "content": {
                "application/json": {
                  "example": [
                    {
                      "id": 1,
                      "title": "The Great Gatsby",
                      "author": "F. Scott Fitzgerald"
                    },
                    {
                      "id": 2,
                      "title": "To Kill a Mockingbird",
                      "author": "Harper Lee"
                    }
                  ]
                }
              }
            }
          },
          "x-external-processor": {
            "path": "../examples/exampleJS.js"
          }
        }
      }
    }
```

The _x-external-processor_ file has to contain a function that will then be called from the OpenAPI Mocker via a middleware. The function will receive the request and response objects from the ExpressJS framework and will be able to modify the response object.

```typescript
interface ExternalProcessor {
    (validationPackage: {	uri: string, httpMethod: string, requestBody: any}): { response: any, isIntercepted: boolean }
}
```

```javascript
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
```

If the _isIntercepted_ flag is set to true, the response will be intercepted and the response object will be returned to the client. If the flag is set to false, the response will be handled by the OpenAPI Mocker as usual.

### x-count
The _x-count_ extension has effect only when used on an `array` type property.
If encountered, OpenAPI Mocker will return an array with the given number of elements instead of the default of an
array with a single item.

For example, the following API definition:
```yaml
openapi: '3.0.2'
info:
  title: Cats
  version: '1.0'
servers:
  - url: https://api.cats.test/v1
paths:
  /cat:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                x-count: 5
                items:
                  type: string
```

Will produce the following response:
```JSON
[
    "string",
    "string",
    "string",
    "string",
    "string"
]
```

## Advanced usage

See the [advanced usage docs](docs/README.md) to extend or build your own app upon OpenAPI Mocker.

## Tests

Simply run `npm t`

## Contributing

Issues and PRs are welcome.
