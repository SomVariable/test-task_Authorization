import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LOCAL } from "../constants/auth.constants";


@Injectable()
export class LocalAuthGuard extends AuthGuard( LOCAL ){}