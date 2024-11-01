import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookModule } from './webhook/webhook.module';
@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: '.env',
    //   isGlobal: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql' as const,
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'webhook_db',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
