import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {crash} from "./crash";


@Entity("weather",{schema:"pbcat" } )
export class weather {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"Weather_ID"
        })
    Weather_ID:number;
        

    @Column("varchar",{ 
        nullable:true,
        name:"Description"
        })
    Description:string | null;
        

   
    @OneToMany(type=>crash, crash=>crash.weatherWeather,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    crashs:crash[];
    
}
