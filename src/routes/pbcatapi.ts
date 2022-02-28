import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import PBCATController from "../controller/PBCATController";
import MapFiltersController from "../controller/MapFiltersController";

const router = Router();

/**
 * Define following endpoint
 * get crashes with find 
 * get one crash with ID
 * update one crash with ID
 * 
 */

// PUT
router.put("/crash/:id([0-9]+)", [checkJwt, checkRole(["ADMIN","RW"])], PBCATController.updateOne);
router.put("/createPerson", [checkJwt, checkRole(["ADMIN","RW"])], PBCATController.createPerson);


// DELETE
router.delete("/person/:id([0-9]+)", [checkJwt, checkRole(["ADMIN","RW"])], PBCATController.deletePerson);
router.delete("/unit/:id([0-9]+)", [checkJwt, checkRole(["ADMIN","RW"])], PBCATController.deleteUnit);
router.delete("/charges/:id([0-9]+)", [checkJwt, checkRole(["ADMIN","RW"])], PBCATController.deleteCharge);

//Get all crashes
router.get("/all_crash", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_all_crash);
router.get("/selectPanel", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.selectPanel);
router.get("/crash/:id([0-9]+)",[checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.getOneById);


//For AUX tables Get ALL
router.get("/city", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_city);
router.get("/contributing_factors", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_contributing_factors);



//GET by ID
router.get("/city/:id([0-9]+)", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_city_id);
router.get("/contributing_factors/:id([0-9]+)", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_contributing_factors_id);
router.get("/county/:id([0-9]+)", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_county_id);
router.get("/light_conditions/:id([0-9]+)", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_light_conditions_id);


// routes new tables
router.get("/gis_analysis", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_gis_analysis);
router.get("/gis_analysis_id/:id([0-9]+)", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_gis_analysis_id);



router.get("/rdwy_part", [checkJwt, checkRole(["ADMIN","RW","R"])], PBCATController.get_rdwy_part);

//Main Map
router.post("/mapQuery",[checkJwt, checkRole(["ADMIN","RW","R"])], MapFiltersController.mapQuery);

router.get("/clusterMap",[checkJwt, checkRole(["ADMIN","RW","R"])], MapFiltersController.clusterMap);
router.get("/corridorsPedBike",[checkJwt, checkRole(["ADMIN","RW","R"])], MapFiltersController.getCorridorsPedBike);



export default router;