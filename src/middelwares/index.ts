import * as adminOnly from "./adminOnly";
import * as authOnly from "./authOnly";

export const middlewares = {
  functions: [adminOnly.middleware, authOnly.middleware],
};
