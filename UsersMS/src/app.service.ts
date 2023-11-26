import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello from UsersMS!';
  }

  hi(): string {
    return `Hello from UserMS!`;
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
      throw new Error('Username is not available');
    }

    if (!isEmailAvailable) {
      throw new Error('Email is not available');
    }

    const user = await this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username: username
      }
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email: email
      }
    });
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
      throw new Error('User not found');
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Username or password is incorrect');
    }

    return user;
  }
}
