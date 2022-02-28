import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {rural_urban_type} from "./rural_urban_type";
import {county} from "./county";
import {city} from "./city";
import {weather} from "./weather";
import {surface__condition} from "./surface__condition";
import {surface__type} from "./surface__type";
import {light_conditions} from "./light_conditions";
import {rdwy_classification} from "./rdwy_classification";
import {rdwy_type} from "./rdwy_type";
import {rdwy_alignment} from "./rdwy_alignment";
import {traffic__control} from "./traffic__control";
import {bicycle_types} from "./bicycle_types";
import {bicycle_defects} from "./bicycle_defects";
import {faults} from "./faults";
import {person__injury} from "./person__injury";
import {charges} from "./charges";
import {crash_type} from "./crash_type";
import {gis_analysis} from "./gis_analysis";
import {person} from "./person";
import {unit} from "./unit";
import { rdwy_part } from "./rdwy_part";
import {scorecardsPedBike} from "./scorecardsPedBike"
import { extendedCrash } from "./extendedCrash";


@Entity("crash",{schema:"pbcat" } )
@Index("FK_080ecfdae084778286b9cd4f2eb",["weatherWeather",])
@Index("FK_28cea9a3c129914a75183e78bbb",["surfTypeSurfaceType",])
@Index("FK_31797aec281b9120268e4280cff",["traffCntrlControl",])
@Index("FK_58bd2163f3b74da9577dc78ec7d",["cityCity",])
@Index("FK_6c6ad3210502c8ec9033824dd8c",["lightCondCondition",])
@Index("FK_702a766807bcdae46d65b6acf26",["rdwyTypeRdwyType",])
@Index("FK_93169b47b11bd84de773ca335fa",["rdwyAlgnAlignment",])
@Index("FK_b6399ad57089c1d2e665fdb8d13",["countyCounty",])
@Index("FK_e027a82003536028d2c98cc23b5",["surfCondSurfCond",])
@Index("FK_f71e12342f99b1a76366b2a7c87",["rdwyClassClassification",])
@Index("FK_rural_urban_idx",["ruralUrbanType",])
@Index("FK_bike_type_idx",["bicycleType",])
@Index("FK_bike_defect_idx",["bicycleDefect",])
@Index("FK_fault_idx",["fault",])
@Index("FK_crash_sev_idx",["crashSev",])
@Index("FK_road_part",["road_part",])

export class crash {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"crash_id"
        })
    crash_id:number;

    @OneToOne(() => extendedCrash, (extendedCrash) => extendedCrash.crash)
    extendedCrash: extendedCrash;

    @Column("timestamp",{ 
        nullable:true,
        name:"crash_date"
        })
    crash_date:Date | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"street_name_1"
        })
    street_name_1:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"street_name_2"
        })
    street_name_2:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"street_num_1"
        })
    street_num_1:number | null;
        

    @Column("int",{ 
        nullable:true,
        name:"street_num_2"
        })
    street_num_2:number | null;
        

    @Column("int",{ 
        nullable:true,
        name:"crash_speed"
        })
    crash_speed:number | null;
        

    @Column("int",{ 
        nullable:true,
        name:"lane_num"
        })
    lane_num:number | null;
        

    @Column("float",{ 
        nullable:true,
        precision:11,
        scale:6,
        name:"latitude"
        })
    latitude:number | null;
        

    @Column("float",{ 
        nullable:true,
        precision:11,
        scale:6,
        name:"longitude"
        })
    longitude:number | null;
        

   
    @ManyToOne(type=>rural_urban_type, rural_urban_type=>rural_urban_type.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT', cascade:true,eager:true })
    @JoinColumn({ name:'rural_urban_type_id'})
    ruralUrbanType:rural_urban_type | null;


    @Column("varchar",{ 
        nullable:true,
        name:"school_zone"
        })
    school_zone:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"notes"
        })
    notes:string | null;
        

    @Column("int",{ 
        nullable:false,
        default: () => "'0'",
        name:"progress"
        })
    progress:number | null;
        

   
    @ManyToOne(type=>county, county=>county.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT', cascade:true,eager:true })
    @JoinColumn({ name:'county_countyId'})
    countyCounty:county | null;


   
    @ManyToOne(type=>city, city=>city.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT',cascade:true,eager:true })
    @JoinColumn({ name:'city_cityId'})
    cityCity:city | null;


   
    @ManyToOne(type=>weather, weather=>weather.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT',cascade:true,eager:true  })
    @JoinColumn({ name:'weather_WeatherID'})
    weatherWeather:weather | null;


   
    @ManyToOne(type=>surface__condition, surface__condition=>surface__condition.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT',cascade:true,eager:true  })
    @JoinColumn({ name:'surfCond_SurfCondID'})
    surfCondSurfCond:surface__condition | null;


   
    @ManyToOne(type=>surface__type, surface__type=>surface__type.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' ,cascade:true,eager:true })
    @JoinColumn({ name:'surfType_SurfaceTypeID'})
    surfTypeSurfaceType:surface__type | null;


   
    @ManyToOne(type=>light_conditions, light_conditions=>light_conditions.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' ,cascade:true,eager:true })
    @JoinColumn({ name:'lightCond_conditionId'})
    lightCondCondition:light_conditions | null;


   
    @ManyToOne(type=>rdwy_classification, rdwy_classification=>rdwy_classification.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' ,cascade:true,eager:true })
    @JoinColumn({ name:'rdwyClass_classificationId'})
    rdwyClassClassification:rdwy_classification | null;


   
    @ManyToOne(type=>rdwy_type, rdwy_type=>rdwy_type.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT',cascade:true,eager:true  })
    @JoinColumn({ name:'rdwyType_RdwyTypeId'})
    rdwyTypeRdwyType:rdwy_type | null;


   
    @ManyToOne(type=>rdwy_alignment, rdwy_alignment=>rdwy_alignment.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' ,cascade:true,eager:true })
    @JoinColumn({ name:'rdwyAlgn_alignmentId'})
    rdwyAlgnAlignment:rdwy_alignment | null;


   
    @ManyToOne(type=>traffic__control, traffic__control=>traffic__control.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT',cascade:true,eager:true  })
    @JoinColumn({ name:'traffCntrl_controlId'})
    traffCntrlControl:traffic__control | null;


    @Column("float",{ 
        nullable:true,
        precision:11,
        scale:6,
        name:"actual_lat"
        })
    actual_lat:number | null;
        

    @Column("float",{ 
        nullable:true,
        precision:11,
        scale:6,
        name:"actual_long"
        })
    actual_long:number | null;
        

   
    @ManyToOne(type=>bicycle_types, bicycle_types=>bicycle_types.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' ,cascade:true,eager:true })
    @JoinColumn({ name:'bicycle_type_ID'})
    bicycleType:bicycle_types | null;


   
    @ManyToOne(type=>bicycle_defects, bicycle_defects=>bicycle_defects.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT',cascade:true,eager:true  })
    @JoinColumn({ name:'bicycle_defect_ID'})
    bicycleDefect:bicycle_defects | null;


   
    @ManyToOne(type=>faults, faults=>faults.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' ,cascade:true,eager:true })
    @JoinColumn({ name:'fault_ID'})
    fault:faults | null;


   
    @ManyToOne(type=>person__injury, person__injury=>person__injury.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT',cascade:true,eager:true  })
    @JoinColumn({ name:'crash_sev_ID'})
    crashSev:person__injury | null;


   
    @OneToMany(type=>charges, charges=>charges.crash,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT',cascade:true,eager:true  })
    chargess:charges[] | null;
    

   
    @OneToMany(type=>crash_type, crash_type=>crash_type.crash,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' ,cascade:true,eager:true })
    crashTypes:crash_type[] | null;
    

   
    @OneToMany(type=>gis_analysis, gis_analysis=>gis_analysis.crash,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT',cascade:true,eager:true  })
    gisAnalysiss:gis_analysis[] | null;
    

   
    @OneToMany(type=>person, person=>person.crash,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' ,cascade:true,eager:true })
    persons:person[] | null;

    @OneToMany(
        () => scorecardsPedBike,
        (scorecardsPedBike) => scorecardsPedBike.crash
      )
      scorecardsPedBikes: scorecardsPedBike[];

   
    @OneToMany(type=>unit, unit=>unit.crash,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT',cascade:true,eager:true  })
    units:unit[] | null;

    @ManyToOne(type=>rdwy_part, rdwy_part=>rdwy_part.crashs,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT',cascade:true,eager:true })
    @JoinColumn({ name:'road_part_ID'})
    road_part:rdwy_part | null;


    changeLAT_LONG(new_lat:number,new_long:number) {
        this.actual_lat = new_lat;
        this.actual_long = new_long;

        
      }
    
}
