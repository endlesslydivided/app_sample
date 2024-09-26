import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HYBRID',
        transport: Transport.REDIS,
        options: {
          port: 6379,
          host: 'localhost',
          retryAttempts: 1000,
          retryDelay: 1000,
          keepAlive: 1000,
          autoResubscribe: true,
          retryStrategy: (times: number) => {
            console.log(`Retry strategy called. Attempt number: ${times}`);
            const delay = Math.min(times * 100, 3000);
            console.log(`Calculated delay: ${delay}ms`);
            return delay;
          },
          reconnectOnError: (err) => {
            console.log(`Reconnect on error triggered: ${JSON.stringify(err)}`);
            return true;
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @Inject('HYBRID')
    private client: ClientProxy,
  ) {}
  async onModuleInit() {
    console.log('Module initialized');
    setInterval(async () => {
      this.client.emit('EXAMPLE_PATTERN', 'test string');
    }, 1000);
  }
}
