const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { fixture } = require("../../../support/pageFixture");
const { ApiClient } = require("../../../helper/api/client/ApiClient");
const { SchemaValidator } = require("../../../helper/api/validators/SchemaValidator");
const { inventorySchema } = require("../../../helper/api/schemas/inventory.schema");
const { storeOrderSchema } = require("../../../helper/api/schemas/storeOrder.schema");
const { storeErrorSchema } = require("../../../helper/api/schemas/storeError.schema");
const { ApiLogger } = require("../../../helper/api/logging/ApiLogger");
const { TemplateResolver } = require("../../../helper/api/resolver/TemplateResolver");

const schemaValidator = new SchemaValidator();

const schemaRegistry = {
    inventorySchema,
    storeOrderSchema,
    storeErrorSchema
};

async function logInfo(message) {
    if (fixture.subStepLogger) {
        await fixture.subStepLogger.info(message);
    }
    if (fixture.logger) {
        fixture.logger.info(message);
    }
}

async function logSuccess(message) {
    if (fixture.subStepLogger) {
        await fixture.subStepLogger.success(message);
    }
    if (fixture.logger) {
        fixture.logger.info(message);
    }
}

function resolveTokens(input) {
    if (Array.isArray(input)) {
        return input.map((x) => resolveTokens(x));
    }
    if (input && typeof input === "object") {
        const out = {};
        for (const [k, v] of Object.entries(input)) {
            out[k] = resolveTokens(v);
        }
        return out;
    }
    if (typeof input === "string" && input === "$nowIso") {
        return new Date().toISOString();
    }
    return input;
}

function parseTypedValue(value) {
    if (typeof value !== "string") {
        return value;
    }
    if (value === "$nowIso") {
        return new Date().toISOString();
    }
    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return false;
    }
    if (/^-?\d+(\.\d+)?$/.test(value)) {
        return Number(value);
    }
    return value;
}

function getByPath(source, path) {
    if (!path) {
        return source;
    }
    return path.split(".").reduce((acc, key) => (acc === undefined || acc === null ? acc : acc[key]), source);
}

function getActiveExpected() {
    return fixture.api.activeExpected || (fixture.api.testData || {}).expected || {};
}

Given("User initializes petstore API client", async function () {
    const caseData = fixture.api.testData || {};
    const baseUrl = caseData.baseUrl || process.env.API_BASE_URL || "https://petstore.swagger.io/v2";
    fixture.api.client = new ApiClient(baseUrl, {
        accept: "application/json",
        "Content-Type": "application/json"
    });
    await logSuccess(`API client initialized with base URL: ${baseUrl}`);
});

Given("User loads API case data", async function () {
    const caseData = fixture.api.testData || {};
    if (!caseData.request || !caseData.expected) {
        throw new Error("API case data must contain 'request' and 'expected' sections.");
    }
    await logInfo(`Loaded API case data for Key=${caseData.Key}, Case=${caseData.CaseId}, Env=${caseData.Env}`);
});

When("User sends API request", async function () {
    const caseData = fixture.api.testData;
    const requestData = TemplateResolver.resolveObject(
        resolveTokens(caseData.request || {}),
        fixture.api.context ? fixture.api.context.toObject() : {}
    );
    const method = String(requestData.method || "GET").toUpperCase();
    const path = requestData.path;
    const headers = requestData.headers || {};
    const body = requestData.body;

    fixture.api.lastRequest = { method, path, headers, body };
    fixture.api.activeExpected = caseData.expected || {};
    await logInfo(`Sending API request: ${method} ${path}`);
    if (body !== undefined) {
        await logInfo(`Request body: ${JSON.stringify(body)}`);
    }
    fixture.api.lastResponse = await fixture.api.client.request(method, path, { headers, body });
    ApiLogger.logTransaction(fixture.logger, fixture.api.lastResponse.request, fixture.api.lastResponse);
    await logSuccess(`Received response: status=${fixture.api.lastResponse.status}, duration=${fixture.api.lastResponse.durationMs}ms`);
});

When("User sends follow-up API request", async function () {
    const caseData = fixture.api.testData;
    const followUp = caseData.followUpRequest || {};
    if (!followUp.method || !followUp.path) {
        throw new Error("followUpRequest with method and path is required.");
    }

    const requestData = TemplateResolver.resolveObject(
        resolveTokens(followUp),
        fixture.api.context ? fixture.api.context.toObject() : {}
    );
    const method = String(requestData.method).toUpperCase();
    const path = requestData.path;
    const headers = requestData.headers || {};
    const body = requestData.body;

    fixture.api.lastRequest = { method, path, headers, body };
    fixture.api.activeExpected = caseData.followUpExpected || {};
    await logInfo(`Sending follow-up API request: ${method} ${path}`);
    if (body !== undefined) {
        await logInfo(`Follow-up request body: ${JSON.stringify(body)}`);
    }

    const expectedStatus = Number((caseData.followUpExpected || {}).status || 200);
    let response;
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        response = await fixture.api.client.request(method, path, { headers, body });
        ApiLogger.logTransaction(fixture.logger, response.request, response);
        if (response.status === expectedStatus || attempt === maxAttempts) {
            break;
        }
        await logInfo(`Follow-up attempt ${attempt} returned ${response.status}; retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    fixture.api.lastResponse = response;
    await logSuccess(`Received follow-up response: status=${fixture.api.lastResponse.status}, duration=${fixture.api.lastResponse.durationMs}ms`);
});

When(
    'User sends {string} request to {string} with payload id {string} petId {string} quantity {string} shipDate {string} status {string} complete {string}',
    async function (method, path, id, petId, quantity, shipDate, status, complete) {
        const caseData = fixture.api.testData;
        const requestData = resolveTokens(caseData.request || {});
        const headers = requestData.headers || {};
        const body = {
            id: parseTypedValue(id),
            petId: parseTypedValue(petId),
            quantity: parseTypedValue(quantity),
            shipDate: parseTypedValue(shipDate),
            status: parseTypedValue(status),
            complete: parseTypedValue(complete)
        };

        fixture.api.lastRequest = { method, path, headers, body };
        fixture.api.activeExpected = caseData.expected || {};
        await logInfo(`Sending API request: ${method} ${path}`);
        await logInfo(`Request body: ${JSON.stringify(body)}`);

        fixture.api.lastResponse = await fixture.api.client.request(method, path, { headers, body });
        ApiLogger.logTransaction(fixture.logger, fixture.api.lastResponse.request, fixture.api.lastResponse);
        await logSuccess(`Received response: status=${fixture.api.lastResponse.status}, duration=${fixture.api.lastResponse.durationMs}ms`);
    }
);

Then("API response status code should be {string}", async function (expectedFromStep) {
    const expectedStatus = Number(expectedFromStep);
    expect(fixture.api.lastResponse).toBeTruthy();
    expect(fixture.api.lastResponse.status).toBe(expectedStatus);
    await logSuccess(`Validated status code. Expected=${expectedStatus}, Actual=${fixture.api.lastResponse.status}`);
});

Then("API response content type should contain {string}", async function (expectedContains) {
    if (!expectedContains) {
        return;
    }
    const contentType = fixture.api.lastResponse.headers["content-type"] || "";
    expect(contentType).toContain(expectedContains);
    await logSuccess(`Validated content type contains '${expectedContains}'. Actual='${contentType}'`);
});

Then("API response schema should be {string}", async function (schemaName) {
    if (!schemaName || schemaName.toUpperCase() === "NA" || schemaName.toUpperCase() === "NONE") {
        await logInfo("Schema validation skipped for this case.");
        return;
    }

    const schema = schemaRegistry[schemaName];
    if (!schema) {
        throw new Error(`Unknown schema '${schemaName}'.`);
    }
    schemaValidator.validate(schema, fixture.api.lastResponse.body, schemaName);
    await logSuccess(`Validated response schema: ${schemaName}`);
});

Then("API response body should match expected values", async function () {
    const expected = getActiveExpected();
    const responseBody = fixture.api.lastResponse.body || {};
    const bodyEquals = expected.bodyEquals || {};
    const containsKeys = expected.containsKeys || [];
    const rawContains = expected.rawContains || [];
    const ignoreFields = new Set(expected.ignoreFields || []);

    for (const key of containsKeys) {
        expect(responseBody).toHaveProperty(key);
        await logSuccess(`Validated response has key '${key}'`);
    }

    for (const [key, expectedValue] of Object.entries(bodyEquals)) {
        if (ignoreFields.has(key)) {
            continue;
        }
        const actualValue = getByPath(responseBody, key);
        expect(actualValue).toEqual(expectedValue);
        await logSuccess(`Validated '${key}' => expected '${expectedValue}', actual '${actualValue}'`);
    }

    for (const token of rawContains) {
        const raw = typeof responseBody.raw === "string" ? responseBody.raw : JSON.stringify(responseBody);
        expect(raw).toContain(token);
        await logSuccess(`Validated raw response contains '${token}'`);
    }
});

Then("API response status code should match active expected value", async function () {
    const expectedStatus = Number(getActiveExpected().status || 200);
    expect(fixture.api.lastResponse.status).toBe(expectedStatus);
    await logSuccess(`Validated active expected status. Expected=${expectedStatus}, Actual=${fixture.api.lastResponse.status}`);
});

Then("User stores response field {string} as {string}", async function (responsePath, contextKey) {
    const value = getByPath(fixture.api.lastResponse, responsePath);
    if (value === undefined || value === null || value === "") {
        throw new Error(`Cannot store value. Path '${responsePath}' not found in response.`);
    }
    fixture.api.context.set(contextKey, value);
    await logSuccess(`Stored response field '${responsePath}' as context key '${contextKey}' with value '${value}'`);
});

Then('API response field {string} should equal context key {string}', async function (responsePath, contextKey) {
    const actualValue = getByPath(fixture.api.lastResponse, responsePath);
    const expectedValue = fixture.api.context.get(contextKey);
    expect(actualValue).toEqual(expectedValue);
    await logSuccess(`Validated response field '${responsePath}' equals context '${contextKey}' -> '${expectedValue}'`);
});
