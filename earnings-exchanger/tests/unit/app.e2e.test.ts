import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { describe, it, expect } from '@jest/globals';
import { lambdaHandler } from '../../app';

describe('e2e test for app handler', function () {
    it('returns error when queryStringParameters is missing', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            httpMethod: 'GET',
            body: '',
            headers: {},
            path: '/averageEarning',
        };

        const result: APIGatewayProxyResult = await lambdaHandler(event as APIGatewayProxyEvent);

        expect(result.statusCode).toEqual(400);
        expect(JSON.parse(result.body)).toEqual({ errors: ['targetCur is a required field'], field: 'targetCur' });
    });

    it('returns error when "cur" parameter is missing', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            httpMethod: 'GET',
            body: '',
            headers: {},
            path: '/averageEarning',
            queryStringParameters: {
                targetCur: 'USD', // Only targetCur is provided, cur is missing
            },
        };

        const result: APIGatewayProxyResult = await lambdaHandler(event as APIGatewayProxyEvent);

        expect(result.statusCode).toEqual(400);
        expect(JSON.parse(result.body)).toEqual({ errors: ['cur must be a comma-separated string'], field: 'cur' });
    });

    it('returns error when "targetCur" parameter is missing', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            httpMethod: 'GET',
            body: '',
            headers: {},
            path: '/averageEarning',
            queryStringParameters: {
                cur: 'USD,EUR', // Only cur is provided, targetCur is missing
            },
        };

        const result: APIGatewayProxyResult = await lambdaHandler(event as APIGatewayProxyEvent);

        expect(result.statusCode).toEqual(400);
        expect(JSON.parse(result.body)).toEqual({ errors: ['targetCur is a required field'], field: 'targetCur' });
    });

    it('verifies successful response', async () => {
        const event: APIGatewayProxyEvent = {
            httpMethod: 'GET',
            body: '',
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: null,
            path: '/averageEarning',
            pathParameters: {},
            queryStringParameters: {
                cur: 'USD,EUR',
                targetCur: 'USD',
            },
            resource: '/averageEarning',
            stageVariables: {}, // Added stageVariables
            requestContext: {
                // Added requestContext with properties
                accountId: '',
                apiId: '',
                authorizer: {},
                domainName: '',
                domainPrefix: '',
                extendedRequestId: '',
                httpMethod: 'GET',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/averageEarning',
                protocol: '',
                requestId: '',
                requestTime: '',
                requestTimeEpoch: 0,
                resourceId: '',
                resourcePath: '',
                stage: '',
            },
        };

        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);

        const responseBody = JSON.parse(result.body);
        expect(responseBody).toHaveProperty('average');
        expect(responseBody).toHaveProperty('currency');
        expect(responseBody.currency).toEqual('USD');
    });
});
