import { Product } from "src/products/entities/product.entity";
import { text } from "stream/consumers";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    password: string;

    @Column({
        type: 'text',
        nullable: false
    })
    fullName: string;

    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean

    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];


    @OneToMany(
        () => Product, 
        ( product ) => product.user
    )
    product: Product

    @BeforeInsert()
    checkEmailBeforeInsert(){
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkEmailBeforeUpdate(){
        this.email = this.email.toLowerCase().trim()
    }

}
