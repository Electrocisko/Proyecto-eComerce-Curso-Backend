import { Router } from "express";
import services from "../dao/index.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    let result = await services.usersService.getAll();
    res.send(result);
  } catch (error) {
    console.log("Error route appi users", error);
  }
});


router.put('/:userId',async (req,res) => {
  let id = req.paramas.userId;
  let modifiedUser = req.body;
  let result = await services.usersService.update(id,modifiedUser)
  res.send(result);
})



export default router;