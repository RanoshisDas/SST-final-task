import {createParamDecorator, ExecutionContext, Injectable} from "@nestjs/common";

export const CurrentUser=
    createParamDecorator((data:never,req: ExecutionContext)=> {
        return req.switchToHttp().getRequest().currentUser;
    });