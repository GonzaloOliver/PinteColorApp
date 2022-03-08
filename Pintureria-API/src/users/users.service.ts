import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppRoles } from 'src/app.roles';
import { IPaginationOptions, Page } from 'src/pagination';
import { StoresService } from 'src/stores/stores.service';
import { SetRoleDto, ChangePasswordDto, ChangeOwnPasswordDto, CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly storesService: StoresService,
  ) {}

  async exists(id: number): Promise<User> {
    const userExists = await this.usersRepository.findOne(id);

    if (!userExists) throw new NotFoundException('El usuario no existe');

    return userExists;
  }

  async usernameExists(username: string, id?: number): Promise<User> {
    const userExists = await this.usersRepository.findOneByUsername(username);

    if (userExists && userExists.id != id) throw new ConflictException('El nombre de usuario ya esta siendo utilizado');

    return userExists;
  }

  validatePassword(password: string, repeatPassword: string): void {
    if (password != repeatPassword) throw new BadRequestException('Las contraseñas ingresadas no coinciden');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.usernameExists(createUserDto.username);

    this.validatePassword(createUserDto.password, createUserDto.repeatPassword);

    const user = new User(createUserDto);

    if (createUserDto.store) user.store = await this.storesService.exists(createUserDto.store.id);

    return await this.usersRepository.save(user);
  }

  async getProfile(id: number): Promise<User> {
    const user = await this.exists(id);
    return user;
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<User>> {
    return await this.usersRepository.findAndPaginate(params);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.exists(id);
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneByUsername(username);
    if (!user) throw new NotFoundException('El usuario no existe');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.exists(id);

    await this.usernameExists(updateUserDto.username, id);

    await this.usersRepository.update(id, updateUserDto);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    await this.exists(id);

    await this.usersRepository.softDelete(id);

    return true;
  }

  async setRole(userId: number, setRoleDto: SetRoleDto) {
    const userExists = await this.exists(userId);
    const role = setRoleDto.roles[0];

    const roleExists = role in AppRoles;
    if (!roleExists) throw new NotFoundException('El rol no existe');

    const user = new User();
    user.setRole(role);

    if (userExists.roles.includes(role)) throw new NotAcceptableException('El usuario ya posee este rol');

    const wasUpdated = await this.usersRepository.update(userId, user);

    if (wasUpdated) return { status: 200, message: 'Rol cambiado' };
  }

  async changeOwnPassword(userId: number, changeOwnPasswordDto: ChangeOwnPasswordDto) {
    const user = await this.exists(userId);

    await this.validatePassword(changeOwnPasswordDto.newPassword, changeOwnPasswordDto.repeatNewPassword);

    return user.setPassword(changeOwnPasswordDto.newPassword, changeOwnPasswordDto.oldPassword);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.exists(userId);

    await this.validatePassword(changePasswordDto.newPassword, changePasswordDto.repeatNewPassword);

    return user.setPassword(changePasswordDto.newPassword);
  }

  async initDB() {
    if ((await this.usersRepository.count()) == 0) {
      const user = new User();
      user.username = this.configService.get('DEFAULT_ADMIN_USER');
      user.roles = [AppRoles.ADMIN];
      user.password = this.configService.get('DEFAULT_ADMIN_PASSWORD');
      user.firstName = 'admin';
      user.lastName = 'admin';
      user.store = await this.storesService.exists(1);

      await this.usersRepository.save(user);
    }
  }
}
