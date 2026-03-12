import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../dtos/create-user.dto";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { JwtService } from "@nestjs/jwt";
import {User} from "../users/user.entity";

const Scrypt = promisify(scrypt);

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async createUser(userDto: CreateUserDto) {

        const user = await this.usersService.find(userDto.email);

        if (user) {
            throw new BadRequestException('Email in use');
        }

        const salt = randomBytes(8).toString('hex');
        const hash = (await Scrypt(userDto.password, salt, 32)) as Buffer;
        const password = salt + "." + hash.toString('hex');

        const newUser = await this.usersService.createUser(
            userDto.name,
            userDto.email,
            password
        );

        const token=this.generateToken(newUser.id);

        return {
            ...token,
            userId:newUser.id,
        };
    }

    async signIn(email: string, password: string) {

        const user = await this.usersService.find(email);

        if (!user) {
            throw new UnauthorizedException('Wrong email or password');
        }

        const [salt, dbHash] = user.password.split('.');
        const hash = (await Scrypt(password, salt, 32)) as Buffer;

        if (dbHash !== hash.toString('hex')) {
            throw new UnauthorizedException('Wrong email or password');
        }
        const UserId=user.id;
        const token=this.jwtService.sign({UserId},{expiresIn:'2Days'})

        return {
            token,
            userId:user.id,
        };
    }

    private generateToken(userId:number) {

        return {
            access_token: this.jwtService.sign({userId}, {expiresIn: '1Day'})
        };
    }
}