import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import { authRouter } from "../modules/auth/auth.routes";




export const router = Router();
const moduleRoutes = [

  {
    path: "/users",
    route: userRouter,
  },
  
  {
    path: "/auth",
    route: authRouter,
  },
 
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
