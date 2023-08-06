'use strict';

const { HttpError, ApplicationError } = require('@strapi/utils').errors;
const {
  formatApplicationError,
  formatHttpError,
  formatInternalError,
} = require('../services/errors');

module.exports = (/* _, { strapi } */) => {
  return async (ctx, next) => {
    const start = Date.now();
    try {
      await next();

      if (!ctx.response._explicitStatus) {
        return ctx.notFound();
      }
    } catch (error) {
      if (error instanceof ApplicationError) {
        const { status, body } = formatApplicationError(error);
        ctx.status = status;
        ctx.body = body;
        return;
      }

      if (error instanceof HttpError) {
        const { status, body } = formatHttpError(error);
        ctx.status = status;
        ctx.body = body;
        return;
      }


      const { status, body } = formatInternalError(error);
      ctx.status = status;
      ctx.body = body;

      const delta = Math.ceil(Date.now() - start);
      strapi.log.http(`${ctx.method} ${ctx.url} (${delta} ms) ${ctx.status} ${error} ${error?.details}`);
    }
  };
};
