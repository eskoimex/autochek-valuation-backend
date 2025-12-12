import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../utils/enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', default: UserRole.AGENT })
  role!: UserRole;
}
