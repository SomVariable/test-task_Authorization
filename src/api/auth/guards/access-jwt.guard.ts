import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACCESS_JWT_STRATEGY } from "../constants/auth.constants";


@Injectable()
export class AccessJwtAuthGuard extends AuthGuard( ACCESS_JWT_STRATEGY ){
    
}