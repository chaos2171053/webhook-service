import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Webhook } from './webhook.entity';
import { WebhookProcessor } from './webhook.processor';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    TypeOrmModule.forFeature([Webhook]),
    // BullModule.forRoot({}),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'webhookQueue',
    }),
  ],
  providers: [WebhookService, WebhookProcessor],

  controllers: [WebhookController],
})
export class WebhookModule {}
