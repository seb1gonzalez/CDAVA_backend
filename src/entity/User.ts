import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";


@Entity("user",{schema:"pbcat" } )
@Index("IDX_78a916df40e02a9deb1c4b75ed",["username",],{unique:true})
export class User {
    
  @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        unique: true,
        name:"username"
        })
    username:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"password"
        })
    password:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"role"
        })
    role:string;
        

    @Column("datetime",{ 
        nullable:false,
        default: () => "'CURRENT_TIMESTAMP(6)'",
        name:"createdAt"
        })
    createdAt:Date;
        

    @Column("datetime",{ 
        nullable:false,
        default: () => "'CURRENT_TIMESTAMP(6)'",
        name:"updatedAt"
        })
    updatedAt:Date;

    @Column("boolean",{ 
        nullable:false,
        name:"logoutActive"
        })
    logoutActive:boolean;
    

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
      }
    
      checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
      }
        
}export default User;
