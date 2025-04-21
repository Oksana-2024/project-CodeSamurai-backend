import path from 'node:path';

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
export const TOKEN_VALID_UNTIL = 24 * 60 * 60 * 1000;
