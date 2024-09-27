import { Router } from "express";
import { healthCheck, tokenCheck } from "../controllers/healthcheck.controller.js";


const router=new Router();

router.route('/').get(healthCheck);
router.route('/tokencheck').get(tokenCheck);

export default router;