import { Test, TestingModule } from '@nestjs/testing';
import { UserInfoMsController } from './user-info-ms.controller';

describe('UserInfoMsController', () => {
  let controller: UserInfoMsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInfoMsController],
    }).compile();

    controller = module.get<UserInfoMsController>(UserInfoMsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
