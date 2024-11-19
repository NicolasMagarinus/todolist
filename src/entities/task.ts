import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("task")
export class Task {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  tittle!: string

  @Column()
  description!: string

  @Column()
  startDate!: Date

  @Column()
  endDate!: Date

  @Column()
  priority!: number
}

export default Task;
