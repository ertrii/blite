import { CORS_ORIGIN } from '@config/server';
import cors from 'cors';
import { Express } from 'express';

export default function enableCors(app: Express) {
  // CORS is a node.js package for providing a Connect/Express
  // middleware that can be used to enable CORS with various options.

  /**
   * Open server for a list clients request
   */
  const whitelist = CORS_ORIGIN.split(',').map((v) => v.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
        } else if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
      credentials: true,
    }),
  );
}
