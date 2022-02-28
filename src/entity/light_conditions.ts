import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {crash} from "./crash";


@Entity("light_conditions",{schema:"pbcat" } )
export class light_conditions {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"condition_id"
        })
    condition_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        name:"description"
        })
    description:string | null;
        

   
    @OneToMany(type=>crash, crash=>crash.lightCondCondition,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    crashs:crash[];
    
}
