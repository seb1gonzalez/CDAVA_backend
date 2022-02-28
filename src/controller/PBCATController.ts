import { Request, Response, response } from "express";
import { getRepository, createQueryBuilder, Long, AdvancedConsoleLogger, getConnection } from "typeorm";
import { crash } from "../entity/crash";
import { person } from "../entity/person";
import { plainToClass } from "class-transformer";
import { city } from "../entity/city";
import { person__alcohol } from "../entity/person__alcohol";
import { contributing_factors } from "../entity/contributing_factors";
import { county } from "../entity/county";
import { person__drug } from "../entity/person__drug";
import { person__ethnicity } from "../entity/person__ethnicity";
import { person__gender } from "../entity/person__gender";
import { person__helmet } from "../entity/person__helmet";
import { person__injury } from "../entity/person__injury";
import { person__type } from "../entity/person__type";
import { rdwy_type } from "../entity/rdwy_type";
import { surface__condition } from "../entity/surface__condition";
import { surface__type } from "../entity/surface__type";
import { traffic__control } from "../entity/traffic__control";
import { vehicle__body } from "../entity/vehicle__body";
import { vehicle_defects } from "../entity/vehicle_defects";
import { weather } from "../entity/weather";
import { vehicle__description } from "../entity/vehicle__description";
import { rdwy_alignment } from "../entity/rdwy_alignment";
import { rdwy_classification } from "../entity/rdwy_classification";
import { light_conditions } from "../entity/light_conditions";
import { unit } from "../entity/unit";
import { charges } from "../entity/charges";
import { rural_urban_type } from "../entity/rural_urban_type";
import { gis_analysis } from "../entity/gis_analysis";
import { faults } from '../entity/faults';
import { freight_network } from '../entity/freight_network';
import { bicycle_defects } from '../entity/bicycle_defects';
import { bicycle_types } from '../entity/bicycle_types';
import { median_type } from '../entity/median_type';
import { school_types } from '../entity/school_types';
import { school_type_gis } from '../entity/school_type_gis';
import { sidewalk_presence } from '../entity/sidewalk_presence';
import { street_parking } from '../entity/street_parking';
import { crash_type } from '../entity/crash_type';
import { marked_crosswalks } from "../entity/marked_crosswalks";
import { stringify } from "querystring";
import { rdwy_part } from "../entity/rdwy_part"
import { countermeasures } from "../entity/countermeasures"
import { JsonWebTokenError } from "jsonwebtoken";

class PBCATController {




  static get_all_crash = async (req: Request, res: Response) => {
    const rep = getRepository(crash);
    try {
      const crashes = await rep.find();
      res.status(200).send(crashes)

    } catch (error) {
      res.status(500).send(error);
    }
  };






  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = req.params.id;

    //console.log(id)
    const crashRepository = getRepository(crash);
    try {
      const crash = await crashRepository.findOneOrFail(id);
      //  //console.log(crash)
      res.send(crash)
    } catch (error) {
      res.status(500).send(error);
    }
  };


  // finds crash based on find_clause ...not used
  static find = async (req: Request, res: Response) => {
    //Get the ID from the url
    const find_clause = req.body;
    ////console.log(find_clause)
    const crashRepository = getRepository(crash);
    try {
      const crashes = await crashRepository.find(find_clause);
      res.send(crashes)
    } catch (error) {
      res.status(500).send(error);
    }

  };

  /*
   {"where":[{"typePersonType":{"Person_Type_ID": 3}},{"typePersonType":{"Person_Type_ID": 4}}],"relations":["crash","crash.unit","crash.charges"]}
   */
  static findPerson = async (req: Request, res: Response) => {
    //Get the ID from the url
    const find_clause = req.body;
    // //console.log(find_clause)
    const personRepository = getRepository(person);
    try {
      const people = await personRepository.find(find_clause);
      ////console.log(people)
      res.send(people)
    } catch (error) {
      res.status(500).send(error);
    }

  };

  // UPDATE LAT LONG FOR A GIVEN CRASH
  static updateCrashLatLong = async (req: Request, res: Response) => {

    try {
      let { crash_id, new_lat, new_long } = req.body;
      const crashRepository = getRepository(crash);
      var dummy = await crashRepository.findOneOrFail(crash_id);
      dummy.changeLAT_LONG(new_lat, new_long);
      res.status(204).send(await crashRepository.save(dummy));

    } catch (error) {
      ////console.log(error)
      res.status(500).send(error); ////console.log(error);
    }

  };



  //left panel stuff..
  static selectPanel = async (req: Request, res: Response) => {
    //Get the ID from the url
    // const find_clause = req.body;
    // //console.log(find_clause)
    const crashRepository = getRepository(crash);
    try {
      const crashes = await createQueryBuilder("crash")
        .select(["crash.crash_id", "crash.crash_date", "crash.latitude", "crash.longitude", "crash.progress"])
        .leftJoinAndSelect("crash.persons", "person")
        .leftJoinAndSelect("person.typePersonType", "person__type")
        .leftJoinAndSelect("person.injuryPersonInjury", "person__injury")
        .where("person.typePersonType.Person_Type_ID IN (:personTypeIds)", { personTypeIds: [3, 4] })
        .andWhere("year(crash.crash_date)>2013")
        .getMany();

      res.send(crashes)
    } catch (error) {
      res.status(500).send(error); ////console.log(error);
    }
  };



  static updateOne = async (req: Request, res: Response) => {
    //Get the ID from the url
    try {
      const id: number = req.params.id;
      const obj = req.body
      const _crash = <crash>plainToClass(crash, obj);// will not work for any arrays need to add @Type to all entities
      // //console.log("URL ID:", id)
      // //console.log(_crash)
      if (_crash.crash_id != id) { throw new Error('Something bad happened.. the crash_id does not match with the id in the payload'); }
      const crashRepository = getRepository(crash);
      var dummy = await crashRepository.findOneOrFail(_crash.crash_id)
      // //console.log(_crash)
      var sav = Object.assign(dummy, _crash)//necessary to delete person/unit/changes... was complaining that crash_id is not set
      res.status(204).send(await crashRepository.save(sav));
    } catch (error) {
      // //console.log(error)
      res.status(500).send(error);// //console.log(error);
    }
  };

  static createPerson = async (req: Request, res: Response) => {
    try {
      const id = req.body.crash_id;
      const crashRepository = getRepository(crash);
      var c = await crashRepository.findOneOrFail(id)
      const personRepository = getRepository(person);
      var p = new person();
      p.crash = c
      await personRepository.insert(p)
      res.send(p)
    } catch (error) {
      //console.log(error)
      res.status(500).send(error);// //console.log(error);
    }

  }
  static createUnit = async (req: Request, res: Response) => {
    try {
      const id = req.body.crash_id;
      const crashRepository = getRepository(crash);
      var c = await crashRepository.findOneOrFail(id)
      const unitRepository = getRepository(unit);
      var u = new unit();
      u.crash = c
      await unitRepository.insert(u)
      res.send(u)
    } catch (error) {
      // //console.log(error)
      res.status(500).send(error); ////console.log(error);
    }

  }
  static createCharge = async (req: Request, res: Response) => {
    try {
      const id = req.body.crash_id;
      const crashRepository = getRepository(crash);
      var c = await crashRepository.findOneOrFail(id)
      const chargesRepository = getRepository(charges);
      var u = new charges();
      u.crash = c
      await chargesRepository.insert(u)
      res.send(u)
    } catch (error) {
      //console.log(error)
      res.status(500).send(error); //console.log(error);
    }

  }
  static deletePerson = async (req: Request, res: Response) => {

    const id: number = req.params.id;
    const repo = getRepository(person);
    try {
      const c = await repo.findOneOrFail(id);
      await repo.delete(c.id)
      res.status(204).send()
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  }
  static deleteUnit = async (req: Request, res: Response) => {

    const id: number = req.params.id;
    const repo = getRepository(unit);
    // //console.log(id);
    // //console.log(repo)
    try {
      const c = await repo.findOneOrFail(id);
      //console.log("UNIT to delete:",c)
      await repo.delete(c.id)
      //console.log("Deleted Unit",c.id)
      res.status(204).send()
    } catch (error) {
      res.status(500).send(error); //console.log(error); 
    }
  }

  static deleteCharge = async (req: Request, res: Response) => {

    const id: number = req.params.id;
    const repo = getRepository(charges);
    try {
      const c = await repo.findOneOrFail(id);
      await repo.delete(c.id)
      res.status(204).send()
    } catch (error) {
      res.status(500).send(error); //console.log(error); 
    }
  }

  static get_city = async (req: Request, res: Response) => {
    const rep = getRepository(city);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_contributing_factors = async (req: Request, res: Response) => {
    const rep = getRepository(contributing_factors);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_county = async (req: Request, res: Response) => {
    const rep = getRepository(county);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };
  static get_light_conditions = async (req: Request, res: Response) => {
    const rep = getRepository(light_conditions);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__alcohol = async (req: Request, res: Response) => {
    const rep = getRepository(person__alcohol);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };


  static get_person__drug = async (req: Request, res: Response) => {
    const rep = getRepository(person__drug);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__ethnicity = async (req: Request, res: Response) => {
    const rep = getRepository(person__ethnicity);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__gender = async (req: Request, res: Response) => {
    const rep = getRepository(person__gender);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__helmet = async (req: Request, res: Response) => {
    const rep = getRepository(person__helmet);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__injury = async (req: Request, res: Response) => {
    const rep = getRepository(person__injury);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__type = async (req: Request, res: Response) => {
    const rep = getRepository(person__type);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };



  static get_rdwy_alignment = async (req: Request, res: Response) => {
    const rep = getRepository(rdwy_alignment);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_rdwy_classification = async (req: Request, res: Response) => {
    const rep = getRepository(rdwy_classification);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_rdwy_type = async (req: Request, res: Response) => {
    const rep = getRepository(rdwy_type);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_surface__condition = async (req: Request, res: Response) => {
    const rep = getRepository(surface__condition);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_surface__type = async (req: Request, res: Response) => {
    const rep = getRepository(surface__type);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_traffic__control = async (req: Request, res: Response) => {
    const rep = getRepository(traffic__control);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_vehicle__body = async (req: Request, res: Response) => {
    const rep = getRepository(vehicle__body);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_vehicle__description = async (req: Request, res: Response) => {
    const rep = getRepository(vehicle__description);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_vehicle_defects = async (req: Request, res: Response) => {
    const rep = getRepository(vehicle_defects);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_weather = async (req: Request, res: Response) => {
    const rep = getRepository(weather);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_city_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(city);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_contributing_factors_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(contributing_factors);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_county_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(county);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };
  static get_light_conditions_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(light_conditions);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__alcohol_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(person__alcohol);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };


  static get_person__drug_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(person__drug);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__ethnicity_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(person__ethnicity);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__gender_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(person__gender);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__helmet_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(person__helmet);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__injury_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(person__injury);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_person__type_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(person__type);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_rdwy_alignment_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(rdwy_alignment);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_rdwy_classification_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(rdwy_classification);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_rdwy_type_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(rdwy_type);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_surface__condition_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(surface__condition);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_surface__type_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(surface__type);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_traffic__control_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(traffic__control);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_vehicle__body_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(vehicle__body);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_vehicle__description_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(vehicle__description);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_vehicle_defects_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(vehicle_defects);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_weather_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(weather);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_rural_urban_type = async (req: Request, res: Response) => {

    const rep = getRepository(rural_urban_type);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };

  static get_rural_urban_type_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(rural_urban_type);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(500).send(error); //console.log(error);
    }
  };
  static get_gis_analysis = async (req: Request, res: Response) => {
    const rep = getRepository(gis_analysis);
    try {
      const dt = await rep.find();
      //console.log("GIS \n"+ dt);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_gis_analysis_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(gis_analysis);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };



  static get_faults = async (req: Request, res: Response) => {
    const rep = getRepository(faults);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };
  static get_faults_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(faults);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };


  static get_freight_network = async (req: Request, res: Response) => {
    const rep = getRepository(freight_network);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };


  static get_freight_network_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(freight_network);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_bicycle_types = async (req: Request, res: Response) => {
    const rep = getRepository(bicycle_types);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_bicycle_types_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(bicycle_types);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_bicycle_defects = async (req: Request, res: Response) => {
    const rep = getRepository(bicycle_defects);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_bicycle_defects_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(bicycle_defects);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_median_type = async (req: Request, res: Response) => {
    const rep = getRepository(median_type);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };


  static get_median_type_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(median_type);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_sidewalk_presence = async (req: Request, res: Response) => {
    const rep = getRepository(sidewalk_presence);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_sidewalk_presence_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(sidewalk_presence);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_school_types = async (req: Request, res: Response) => {
    const rep = getRepository(school_types);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };
  static get_school_types_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(school_types);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };


  static get_school_type_gis = async (req: Request, res: Response) => {
    const rep = getRepository(school_type_gis);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_school_type_gis_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(school_type_gis);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_street_parking = async (req: Request, res: Response) => {
    const rep = getRepository(street_parking);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_street_parking_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(street_parking);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_crash_type = async (req: Request, res: Response) => {
    const rep = getRepository(crash_type);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_marked_crosswalk = async (req: Request, res: Response) => {
    const rep = getRepository(marked_crosswalks);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_rdwy_part = async (req: Request, res: Response) => {
    const rep = getRepository(rdwy_part);
    try {
      const dt = await rep.find();
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };

  static get_rdwy_part_id = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const rep = getRepository(rdwy_part);
    try {
      const dt = await rep.findOneOrFail(id);
      res.send(dt)
    } catch (error) {
      res.status(404).send(error);
    }
  };


  static table_entity_map = {
    "charges": charges,
    "crash": crash,
    "crash_type": crash_type,
    "gis_analysis": gis_analysis,
    "person": person,
    "unit": unit
  }

  static get_distinct = async (req: Request, res: Response) => {
    try {

      //Get the JSON from the url
      let json_req = req.body;
      //object should have obj.tablename and obj.colname

      // TODO: Fix and gaurd against possible sql injection attack
      let introspection_query = "SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME,"+
      " REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE  COLUMN_NAME ='" + json_req.colname + "' AND TABLE_NAME = '" + json_req.tablename + "' LIMIT 1";
      let o = await getConnection().manager.query(introspection_query)
      //console.log(o)
      if (o.length > 0) {
        let obj = o[0]
        // row returned
        //"SELECT distinct cr.city_cityId, c.Description from city c, crash cr where cr.city_cityId =c.city_id"
        let findQuery = "SELECT distinct B."+json_req.colname+ " AS id"+
        ", A.Description AS label from " +obj.REFERENCED_TABLE_NAME+" A, "+ 
        json_req.tablename+" B where B."+json_req.colname+" =A."+obj.REFERENCED_COLUMN_NAME+
        " AND B."+json_req.colname+" IS NOT NULL"
        let k = await getConnection().manager.query(findQuery)
        res.status(200).send(k)

      } else {
        const obj = await getConnection()
          .createQueryBuilder(PBCATController.table_entity_map[json_req.tablename], "a")
          .select("DISTINCT " + json_req.colname).where(json_req.colname+' IS NOT NULL').orderBy(json_req.colname)
          .getRawMany();

        let k = obj.map(function (x) { return { "id": x[json_req.colname], "label": x[json_req.colname] }; })
        res.status(200).send(k)

      }




    }
    catch (error) {
      res.status(500).send(error);

    }

  };
}
export default PBCATController;