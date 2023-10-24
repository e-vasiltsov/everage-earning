import axios, { ResponseType } from 'axios';

class HttpClientService {
    public static get(
        url: string,
        options: {
            headers?: any;
            body?: any;
            responseType?: ResponseType;
        } = {},
    ): Promise<{
        statusCode: number;
        data: any;
        url: string;
    }> {
        const headersDefault = {};
        const headers = { ...options.headers, ...headersDefault };
        const responseType = options.responseType ?? undefined;

        return axios({
            method: 'get',
            url,
            headers,
            responseType,
        })
            .then(function (response) {
                return {
                    data: response.data,
                    statusCode: response.status,
                    url,
                };
            })
            .catch((err) => {
                if (err.response === undefined) {
                    throw new err();
                }

                return {
                    data: err.response.data,
                    statusCode: err.response.status,
                    url,
                };
            });
    }
}

export const httpClient = HttpClientService;
