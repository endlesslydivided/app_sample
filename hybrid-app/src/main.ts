import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<RedisOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
      // retryAttempts: 1000,
      retryAttempts: 1,
      retryDelay: 1000,
      connectionName: 'HYBRID',
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
  });

  app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
