import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {crash} from "./crash";


@Entity("county",{schema:"pbcat" } )
export class county {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"county_id"
        })
    county_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        name:"description"
        })
    description:string | null;
        

   
    @OneToMany(type=>crash, crash=>crash.countyCounty,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    crashs:crash[];
    
}
