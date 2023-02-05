const router = require("express").Router();

const {
  dictTreeList,
  dictList,
  updateDict,
  createDict,
  dictValue,
} = require("../../../../controller/admin/system/dict");

router.post("/system/createDict", createDict);
router.get("/system/dictTreeList", dictTreeList);
router.post("/system/dictList", dictList);
router.post("/system/updateDict", updateDict);
router.get("/system/dictValue", dictValue);
module.exports = router;
