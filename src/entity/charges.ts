import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {crash} from "./crash";


@Entity("charges",{schema:"pbcat" } )
@Index("crash_charge_idx",["crash",])
export class charges {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:true,
        name:"charge"
        })
    charge:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"units_num"
        })
    units_num:number | null;
        

    @Column("int",{ 
        nullable:true,
        name:"person_num"
        })
    person_num:number | null;
        
//comment
   
    @ManyToOne(type=>crash, crash=>crash.chargess,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'crash_id'})
    crash:crash ;

}
