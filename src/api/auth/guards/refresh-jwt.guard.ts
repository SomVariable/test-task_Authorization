import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JWT_REFRESH } from "../constants/auth.constants";


@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard( JWT_REFRESH ){}