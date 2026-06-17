import middy from '@middy/core';

export const validatorErrorHandler = () => {
    return {
        onError: (request: middy.Request<any, any, any, any, any>) => {
            const error = request.error;
            delete error.cause.package;

            if (error.expose && error.statusCode === 400) {
                request.response = {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: error.message,
                        validationErrors: error.cause.data,
                    }),
                    headers: { 'Content-Type': 'application/json' },
                };
            }
        },
    };
};
