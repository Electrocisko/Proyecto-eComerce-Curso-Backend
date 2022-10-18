import { Router } from "express";
import logger from "../config/winston.config.js";
import services from "../dao/index.js";


const router = new Router();

router.get("/", async (req, res) => {
  try {
    let result = await services.usersService.getAll();
    res.send(result);
  } catch (error) {
    logger.log('error', `Error route api users ${error}`);
  }
});

router.put('/:userId',async (req,res) => {
  try {
    let id = req.paramas.userId;
    let modifiedUser = req.body;
    let result = await services.usersService.update(id,modifiedUser)
    res.send(result);
  } catch (error) {
    logger.log('error', `Error route api userId ${error}`);
  }
})

export default router;
