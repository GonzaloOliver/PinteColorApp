import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', () => {
    const user = new User();
    user.username = 'testing';
    user.password = 'testing';
    user.roles = ['ADMIN'];

    const response = service.create(user);

    expect(response).toBe('Ok');
  });
});
