import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    constructor(username: string, password: string, role: string, salt: number) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.salt = salt;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @Column()
    salt: number;

    @Column({ default: true })
    isActive: boolean;
}