import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {person} from "./person";


@Entity("person__type",{schema:"pbcat" } )
export class person__type {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"Person_Type_ID"
        })
    Person_Type_ID:number;
        

    @Column("varchar",{ 
        nullable:true,
        name:"Description"
        })
    Description:string | null;
        

   
    @OneToMany(type=>person, person=>person.typePersonType,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    persons:person[];
    
}
