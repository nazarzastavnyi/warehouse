import type { ErrorRequestHandler } from 'express';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).send({message: err.message});
};
