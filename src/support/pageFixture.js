const fixture = {
    page: undefined,
    logger: undefined,
    testData: {},
    env: "",
    subStepLogger: undefined,
    pages: {},
    api: {
        client: undefined,
        lastRequest: undefined,
        lastResponse: undefined,
        testData: {},
        activeExpected: {},
        context: undefined
    }
};

module.exports = { fixture };
