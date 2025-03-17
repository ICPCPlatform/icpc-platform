import * as adminOnly from "./adminOnly";
import * as authOnly from "./authOnly";
import * as viewTraining from "./viewTraining";

export const middlewares = {
  // order is needed
  functions: [
    adminOnly.middleware,
    authOnly.middleware,
    viewTraining.middleware,
  ],
};
