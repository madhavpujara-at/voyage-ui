import { User } from '../entities/User';
import { RegisterUserDto } from '../../application/dtos/RegisterUserDto';

export interface IUserRepository {
  register(registerDto: RegisterUserDto): Promise<User>;
}
