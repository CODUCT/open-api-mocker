module.exports = (validationPackage) => {
    let isIntercepted = true;
    const itpServer = "http://localhost:3000"

    console.log(validationPackage);

    // Code that gets executed when request is received belongs here
    // Response can look like this:

    let response = fetch(itpServer + validationPackage.uri, {
        method: validationPackage.httpMethod,
        body: validationPackage.httpMethod == "POST" ? JSON.stringify(validationPackage.requestBody) : undefined,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log("External!!!!", isIntercepted);

    return { response, isIntercepted }
};