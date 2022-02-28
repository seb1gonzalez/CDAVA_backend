import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {crash} from "./crash";


@Entity("rdwy_type",{schema:"pbcat" } )
export class rdwy_type {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"Rdwy_type_id"
        })
    Rdwy_type_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        name:"description"
        })
    description:string | null;
        

   
    @OneToMany(type=>crash, crash=>crash.rdwyTypeRdwyType,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    crashs:crash[];
    
}
