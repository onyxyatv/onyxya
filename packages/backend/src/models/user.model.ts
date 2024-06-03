import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    constructor(username: string, password: string, role: string, salt: string) {
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
    salt: string;

    @Column({ default: true })
    isActive: boolean;
}