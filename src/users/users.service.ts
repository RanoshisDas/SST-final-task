import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./user.entity";
import {randomBytes, scrypt} from "crypto";
import {promisify} from "util";

const Scrypt = promisify(scrypt);

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo:Repository<User>){}

    createUser(name:string,email:string,password:string){
        const user= this.repo.create({name, email, password});
        return this.repo.save(user);
    }

    findOne(id:number){
        if (!id){
            throw new BadRequestException('Invalid ID');
        }
        return this.repo.findOneBy({id});
    }

    find(email:string){
        return this.repo.findOne({where:{email}});
    }

    findAll(){
        return this.repo.find();
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (attrs.email) {
            const existingUser = await this.find(attrs.email);
            if (existingUser && existingUser.id !== id) {
                throw new BadRequestException('Email already in use');
            }
        }

        if (attrs.password) {
            // password with new salt and hash
            const salt = randomBytes(8).toString('hex');
            const hash = (await Scrypt(attrs.password, salt, 32)) as Buffer;
            attrs.password = salt + "." + hash.toString('hex');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id:number){

        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('User not found');
        }
        return this.repo.remove(user);
    }

    async updatePassword(id:number,password:string) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        // password with old salt and new hash
        const [salt,passwordHash]=user.password.split(".");

        const newPassHash=(await Scrypt(password,salt,32)) as Buffer;
        user.password=salt + "." + newPassHash;
        return this.repo.save(user);

    }


}
