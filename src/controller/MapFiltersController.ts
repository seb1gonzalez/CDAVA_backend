import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { getConnection, getRepository } from "typeorm";
import { crash } from "../entity/crash"
import {MapLogs} from "../entity/map_logs"

import { pedbikeClusters} from "../entity/pedbikeClusters"
import { QueryLogger } from "../helpers/QueryLogger"
import {pedbikeClusterCm} from "../entity/pedbikeClusterCm"
import {scorecardsPedBike} from "../entity/scorecardsPedBike"
import { countermeasures } from "../entity/countermeasures";



class crashAndLocaton {
  crash_id: number;
  latitude: number;
  longitude: number;
}
let scorecard_data = []

function quote_str(s) {
  return '"' + s + '"'
}

function createWhere(row) {
  let key = row.table + "." + row.param
  // in or between?
  if ((row.value).length > 1) {
    //between 
    // if(row.param == "crash_date"){
    //   key ="YEAR(" +key +") "+ " BETWEEN " + quote_str(row.value[0]) + " AND " + quote_str(row.value[1])
    // }
    // else{
    key = key + " BETWEEN " + quote_str(row.value[0]) + " AND " + quote_str(row.value[1])
    // }

  } else {
    // using =
    key = key + " = " + quote_str(row.value[0])
  }
  return { unique_key: row.table + "." + row.param, query_row: key }
}

class MapFiltersController {

  static queryLogger: QueryLogger = new QueryLogger()
  //static user: any = "";// get the userID from response

  /**
   * Recieves a JSON request with parameters to filter and returs the crashids that match the filters 
   * @param req JSON that describes filters
   * 
   * @param res map with an array of crashids stored in "crashids" variable
   */
  static mapQuery = async (req: Request, res: Response) => {

    try {
      //Get the JSON from the url
      let json_req = req.body;

      //log query
      json_req.filters.forEach(query => {
        MapFiltersController.queryLogger.log_query(query.table, query.param, query.value, res.locals.jwtPayload.userId)
      });


      let query_head = `SELECT DISTINCT
                      crash.crash_id,
                      crash.latitude,
                      crash.longitude
                      FROM charges
                      RIGHT JOIN crash
                        ON charges.crash_id = crash.crash_id
                      RIGHT JOIN crash_type
                        ON crash_type.crash_id = crash.crash_id
                      RIGHT JOIN gis_analysis
                        ON gis_analysis.crash_id = crash.crash_id
                      RIGHT JOIN person
                        ON person.crash_id = crash.crash_id
                      RIGHT JOIN unit
                        ON unit.crash_id = crash.crash_id
                      WHERE`
      let combined = {};
      json_req.filters.forEach(element => {
        let wh = createWhere(element)
        if (wh.unique_key in combined) {
          // create OR
          let old = combined[wh.unique_key]
          old = old.substring(0, old.length - 1) // removing trailing )
          combined[wh.unique_key] = old + " OR " + wh.query_row + ")"
        } else {
          //first attempt
          combined[wh.unique_key] = "(" + wh.query_row + ")"

        }
      });
      const values = Object.keys(combined).map(key => combined[key]);

      const ANDJoinedValues = values.join(" AND ");

      let full_query = query_head + ANDJoinedValues
      let obj = await getConnection().manager.query(full_query)
      obj = plainToClass(crashAndLocaton, obj)
      //console.log(obj)
      res.status(200).send(obj)


    }
    catch (error) {
      res.status(500).send(error);

    }

  };


  /**GET: Fetches unique crash-ids with latitude and longitude values */
  static clusterMap = async (req: Request, res: Response) => {
    const rep = getRepository(crash);
    try {
      let crashes = await rep.find(
        {
          select: ["crash_id", "latitude", "longitude"],
        });

      res.send(crashes)
    } catch (error) {
      res.status(404).send(error);
    }
  };


  static getCorridorsPedBike = async (req: Request, res: Response) => {
    let rep_pedbike_clusters = getRepository(pedbikeClusters);

    try {

      let rep_pedbike_corridors = await rep_pedbike_clusters.find();
      res.send(rep_pedbike_corridors)

    } catch (error) {
      res.status(404).send(error);
    }
  };

  static getScorecardCrashes = async (req: Request, res: Response) => {

    let scorecard_pedBike_rep = getRepository(scorecardsPedBike);

    try {
      console.log(req.body)
     
      let rep_pedbike_corridors = await scorecard_pedBike_rep.find(
        

        {
        select:["crashId"],
        where:
          {
            cluster:req.body.cluster_name,
            type:req.body.cluster_type
          }
        });
      res.send(rep_pedbike_corridors)

    } catch (error) {
      res.status(500).send(error);
    }
  };

  //getScorecards() helper
  static findScorecardByCrashID = async (req: Request, res: Response) => {
    let crash_ids = req.body.crash_ids
    let cluster_type = req.body.cluster_type

  }

  static topTenFilters = async (req: Request, res: Response) => {

    try {
      let fetch_topTen = 

      `SELECT table_searched, filters_searched FROM pbcat.map_logs where user = `+res.locals.jwtPayload.userId+`
      GROUP BY table_searched, filters_searched
      HAVING COUNT(filters_searched) > 9;`

      let response: Object[] = await getConnection().manager.query(fetch_topTen)
      response = plainToClass(MapLogs,response)

      res.status(200).send(response)

    } catch (error) {
      res.status(500).send(error);
    }
  };


    static getCountermeasures = async (req: Request, res: Response) => {
      const rep = getRepository(pedbikeClusterCm);
      const counters = getRepository(countermeasures)
      let cluster_name = req.body.cluster_name;
      let cluster_type = req.body.cluster_type;
      if(cluster_type == "BIKE"){cluster_type = "bike"}
      else if(cluster_type == "pedestrian"){cluster_type = "ped"}
      try {
        let counters = await rep.find(
          {
            select: ["cmId"],
            where: [
              { cluster:cluster_name, type: cluster_type },
            ]
          });
  
        res.send(counters)
      } catch (error) {
        res.status(404).send(error);
      }
    };
  
    
  static getCountermeasuresByID = async (req: Request, res: Response) => {

    const rep = getRepository(countermeasures);
    try {
      const counters = await rep.find(
        {
          select:["description","link"],
          where:{countermeasureId: req.body.cmId}
        });

      res.status(200).send(counters)

    } catch (error) {
      res.status(500).send(error);
    }
  };



}
export default MapFiltersController;