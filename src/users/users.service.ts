import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findById(id: number) {
    const userFound = await this.userRepository.findOne({ where: { id: id } });
    if (!userFound) throw new NotFoundException('Usuario no encontrado');
    return userFound;
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOne({ where: { username: username } });
  }

  async create(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUserByUsername)
      throw new ConflictException('El nombre de usuario ya está en uso');

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUserByEmail)
      throw new ConflictException('El email ya está en uso');

    const userCreated = this.userRepository.create(createUserDto);
    return await this.userRepository.save(userCreated);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async delete(id: number) {
    return await this.userRepository.delete(id);
  }

  async updatePartial(id: number, updateUserDto: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({ where: { id: id } });
    if (!userFound) throw new NotFoundException('Usuario no encontrado');
    Object.assign(userFound, updateUserDto);
    return await this.userRepository.save(userFound);
  }
}