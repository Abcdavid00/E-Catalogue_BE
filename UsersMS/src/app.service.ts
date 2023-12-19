import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'UsersMS Online!';
  }

  userWithoutPassword(user: User): User {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  userWithoutPassword(user: User): User {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        username: username
      }
    });

    return user === undefined || user === null;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        email: email
      }
    });

    return user === undefined || user === null;
  }

  async createUser(username: string, email: string, password: string): Promise<User> {
    const [isUsernameAvailable, isEmailAvailable, hashedPassword] = await Promise.all([
      this.isUsernameAvailable(username),
      this.isEmailAvailable(email),
      hash(password, 10),
    ]);

    if (!isUsernameAvailable) {
      throw new RpcException('Username is not available');
    }

    if (!isEmailAvailable) {
      throw new RpcException('Email is not available');
    }

    const user = await this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    return this.userWithoutPassword(await this.userRepository.save(user));
  }

  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      }
    });
    if (!user) {
      throw new RpcException('User not found');
    }
    return this.userWithoutPassword(user);
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username: username
      }
    });
    if (!user) {
      throw new RpcException('User not found');
    }
    return this.userWithoutPassword(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: email
      }
    });
    if (!user) {
      throw new RpcException('User not found');
    }
    return this.userWithoutPassword(user);
  }

  async signIn(usernameOrEmail: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [
        {
          username: usernameOrEmail
        },
        {
          email: usernameOrEmail
        }
      ]
    });

    if (!user) {
      throw new RpcException('User not found');
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new RpcException('Username or password is incorrect');
    }

    return this.userWithoutPassword(user);
  }
}
