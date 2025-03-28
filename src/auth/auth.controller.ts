import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { use } from 'passport';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() ) // ! Ya con esto se valida la autorización :0
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() raw: string[]
  ){

    console.log(raw)

    return {
      ok: true,
      msg: "Hola mundo privado",
      user: user,
      userEmail: email,
      RawHeaders: raw
    }
  }


  @Get('private2')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }
  }


  @Get('private3')
  @Auth( ValidRoles.admin )
  @RoleProtected(  )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute3(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }
  }

}
