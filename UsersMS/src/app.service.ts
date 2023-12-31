import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, parseUserRole } from './entities/user.entity';
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

  async createUser(username: string, email: string, password: string, role: string): Promise<User> {
    try {
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
  
      const userRole = parseUserRole(role)
  
      const user = await this.userRepository.create({
        username,
        email,
        password: hashedPassword,
        role: userRole,
      });
  
      return this.userWithoutPassword(await this.userRepository.save(user));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  generatePassword(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async initAdmin(): Promise<User> {
    const username = 'admin';
    const email = 'admin';
    const password = this.generatePassword(32);
    const role = parseUserRole('admin');

    // Remove all existing admin users
    await this.userRepository.delete({
      role: role
    });

    const admin = await this.createUser(username, email, password, role);
    if (!admin) {
      throw new RpcException('Failed to create admin user');
    }
    return {
      ...admin,
      password: password
    }
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

  async changeRole(param: {
    id: number,
    role: string
  }): Promise<User> {
    if (!param.id) {
      throw new RpcException('Id is required');
    }
    const role = parseUserRole(param.role);
    const user = await this.userRepository.findOne({
      where: {
        id: param.id
      }
    });
    if (!user) {
      throw new RpcException('User not found');
    }
    user.role = role;
    return this.userWithoutPassword(await this.userRepository.save(user));
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

  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      }
    });

    if (!user) {
      throw new RpcException('User not found');
    }

    const isPasswordCorrect = await compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      throw new RpcException('Old password is incorrect');
    }

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;

    return this.userWithoutPassword(await this.userRepository.save(user));
  }

  async changeEmail(id: number, newEmail: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      }
    });

    if (!user) {
      throw new RpcException('User not found');
    }

    const isEmailAvailable = await this.isEmailAvailable(newEmail);
    if (!isEmailAvailable) {
      throw new RpcException('Email is not available');
    }

    user.email = newEmail;

    return this.userWithoutPassword(await this.userRepository.save(user));
  }

  async changeUsername(id: number, newUsername: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      }
    });

    if (!user) {
      throw new RpcException('User not found');
    }

    const isUsernameAvailable = await this.isUsernameAvailable(newUsername);
    if (!isUsernameAvailable) {
      throw new RpcException('Username is not available');
    }

    user.username = newUsername;

    return this.userWithoutPassword(await this.userRepository.save(user));
  }
  
}
