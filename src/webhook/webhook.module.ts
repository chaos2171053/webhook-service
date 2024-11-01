import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Webhook } from './webhook.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Webhook])],
  providers: [WebhookService],

  controllers: [WebhookController],
})
export class WebhookModule {}
