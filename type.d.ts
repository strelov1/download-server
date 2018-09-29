interface Response extends Response {
    headers: object;
    setStatus: (statusCode: int) => Response;
    setHeaders: (obj: object) => Response;
    send: (conteng: string) => Response;
    error: (error: string | Error) => Response;
}
