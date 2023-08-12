import { NextFunction, Request, Response } from 'express';
import bodyExpect from './body-expect';
import queryExpect from './query-expect';
import {
  ControllerMetadata,
  MethodMetaData,
} from '../metadata/interfaces/controller-metadata';
import runGuard from './run-guard';

export default function middleware(
  controller: ControllerMetadata,
  metadata: MethodMetaData,
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const forbiddenOrInternalException = await runGuard(
      [req, res, next],
      controller.guard || metadata.guard,
    );
    if (forbiddenOrInternalException) {
      res
        .status(forbiddenOrInternalException.status)
        .json(forbiddenOrInternalException);
      return;
    }

    /**
     * Validando query schema
     */
    const devException = await queryExpect(req.query, metadata.query);
    if (devException) {
      res.status(devException.status).json(devException);
      return;
    }

    /**
     * Validando body schema
     */
    const schemaException = await bodyExpect(req.body, metadata.body);
    if (schemaException) {
      res.status(schemaException.status).json(schemaException);
      return;
    }

    next();
  };
}
