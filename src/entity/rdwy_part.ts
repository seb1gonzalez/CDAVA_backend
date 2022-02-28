import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {crash} from "./crash";


@Entity("rdwy_part",{schema:"pbcat" } )
export class rdwy_part {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"rdwy_part_ID"
        })
    part_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        name:"Description"
        })
    description:string | null;
        

   
    @OneToMany(type=>crash, crash=>crash.road_part,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    crashs:crash[];
    
}