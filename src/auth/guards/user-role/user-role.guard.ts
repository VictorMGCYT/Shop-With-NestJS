import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.getAllAndOverride(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
 
    console.log(validRoles)

    // Obtener los roles del usuario
    const req = context.switchToHttp().getRequest()
    const user = req.user as User

    if(!user){
      throw new BadRequestException()
    }

    if( validRoles.length === 0 ){
      console.log(validRoles)
      return true
    }

    for( const role of user.roles){
      if( validRoles.includes(role) ){
        return true;
      }
    }

    

    throw new ForbiddenException(
      `User ${user.fullName} doesn't have a valid role like: [${validRoles}]`
    )
  }
}
