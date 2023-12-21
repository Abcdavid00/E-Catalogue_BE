import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from 'src/users/dto/user.dto';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

export const ROLES_KEY = 'roles';
// export const RolesDecorator = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const Roles = (...roles: UserRole[]) => applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
);
