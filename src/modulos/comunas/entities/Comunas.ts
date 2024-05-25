import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"
import { Kapmae } from "../../kapmae/entities/Kapmae";

@Entity({ name: 'COMUNAS'})
export class Comunas {

    @PrimaryGeneratedColumn({name: 'codigo'})
    codigo: number;

    @Column({name: 'descrip'})
    descrip: string;

    @Column({name: 'estado'})
    estado: boolean;

    @OneToOne(() => Kapmae, (kapmae) => kapmae.comuna)
    kapmae: Kapmae;

}
