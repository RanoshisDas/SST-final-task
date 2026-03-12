import {Injectable, NestMiddleware} from "@nestjs/common";
import {UsersService} from "../users/users.service";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User | null;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
    constructor(private usersService: UsersService) {}
    async use(req: any, res: any, next: () => void) {
        const {userId} = req.session || {};
        if(userId) {
            req.currentUser=await this.usersService.findOne(userId);
        }
        next();
    }
}