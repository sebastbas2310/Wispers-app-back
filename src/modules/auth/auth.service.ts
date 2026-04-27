import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Comparar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generar JWT
    const payload = { email: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Debug: mostrar el token en servidor (quitar en prod si quieres)
    console.log('[AuthService] generated JWT:', token);

    return {
      accessToken: token,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    };
  }

  async validateUser(payload: any) {
    // Si el payload contiene los datos del usuario, usarlos directamente
    if (payload.email && payload.role) {
      return {
        id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name,
        profilePicture: payload.profilePicture,
        role: payload.role,
      };
    }

    // Fallback: buscar el usuario en la base de datos
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      role: user.role,
    };
  }
}
