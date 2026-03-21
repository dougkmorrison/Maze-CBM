import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studentRouter from "./student";
import teacherRouter from "./teacher";

const router: IRouter = Router();

router.use(healthRouter);
router.use(studentRouter);
router.use(teacherRouter);

export default router;
