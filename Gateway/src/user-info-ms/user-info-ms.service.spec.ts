import { Test, TestingModule } from '@nestjs/testing';
import { UserInfoMsService } from './user-info-ms.service';

describe('UserInfoMsService', () => {
  let service: UserInfoMsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInfoMsService],
    }).compile();

    service = module.get<UserInfoMsService>(UserInfoMsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
