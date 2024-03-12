import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Request, Response } from "express";
import { IUser } from "src/users/users.interface";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @ResponseMessage("User Login")
  @UseGuards(LocalAuthGuard)
  @Post('login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage("Register a new user")
  @Post('register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage("Get user information")
  @Get('account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @ResponseMessage("Get user by refresh token")
  @Get('refresh')
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['refresh_token']
    return this.authService.processNewToken(refreshToken, response)
  }

  @ResponseMessage("User Logout")
  @Post('logout')
  handleLogout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
    return this.authService.logout(response, user);
  }
}
