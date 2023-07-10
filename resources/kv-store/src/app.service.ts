import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { createClient } from 'redis';

@Injectable()
export class AppService {
}

