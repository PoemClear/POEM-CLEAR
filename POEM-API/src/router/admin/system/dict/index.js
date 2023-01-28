const router = require("express").Router();

const {
  dictTreeList,
  dictList,
  updateDict,
  createDict,
//   delDict,
} = require("../../../../controller/admin/system/dict");

router.post("/system/createDict", createDict);
router.get("/system/dictTreeList", dictTreeList);
router.post("/system/dictList", dictList);
router.post("/system/updateDict", updateDict);
// router.post("/system/delDict", delDict);
module.exports = router;
