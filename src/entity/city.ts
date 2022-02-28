import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {crash} from "./crash";


@Entity("city",{schema:"pbcat" } )
export class city {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"city_id"
        })
    city_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        name:"description"
        })
    description:string | null;
        

   
    @OneToMany(type=>crash, crash=>crash.cityCity,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    crashs:crash[];
    
}
