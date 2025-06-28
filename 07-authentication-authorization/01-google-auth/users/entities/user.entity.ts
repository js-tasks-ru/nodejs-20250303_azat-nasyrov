import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ name: "display_name" })
  displayName: string;

  @Column()
  avatar: string;
}
