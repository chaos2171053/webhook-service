import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webhook } from './webhook.entity';
import { webhookService, WebhookEvent } from './webhook.state';
import axios from 'axios';
import { UpdateWebhookDto } from './dtos/webhook.dto';
import { UpdateStatusDto } from './dtos/updateStatus.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepository: Repository<Webhook>,
    @InjectQueue('webhookQueue') // Inject the BullMQ queue
    private readonly queue: Queue, // The BullMQ queue
  ) {}

  async updateStatus(id: number, updateStatusDto: UpdateStatusDto) {
    const webhook = await this.webhookRepository.findOne({ where: { id } });
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    webhook.status = updateStatusDto.status;

    if (updateStatusDto.status === 'ENABLED') {
      webhookService.send({ type: 'ENABLE' } as WebhookEvent);
    } else if (updateStatusDto.status === 'DISABLED') {
      webhookService.send({ type: 'DISABLE' } as WebhookEvent);
    }

    return await this.webhookRepository.save(webhook);
  }

  async create(webhookData: Partial<Webhook>): Promise<Webhook> {
    const webhook = this.webhookRepository.create(webhookData);
    webhookService.send({ type: 'ENABLE' } as WebhookEvent);
    webhook.status = 'ENABLED';
    return await this.webhookRepository.save(webhook);
  }

  async enable(id: number): Promise<Webhook> {
    const webhook = await this.webhookRepository.findOne({ where: { id } });
    if (webhook) {
      webhookService.send({ type: 'ENABLE' } as WebhookEvent);
      webhook.status = 'ENABLED';
      return await this.webhookRepository.save(webhook);
    }
    throw new Error('Webhook not found');
  }

  async disable(id: number): Promise<Webhook> {
    const webhook = await this.webhookRepository.findOne({ where: { id } });
    if (webhook) {
      webhookService.send({ type: 'DISABLE' } as WebhookEvent);
      webhook.status = 'DISABLED';
      return await this.webhookRepository.save(webhook);
    }
    throw new Error('Webhook not found');
  }

  async trigger(id: number, data: Record<string, any>): Promise<void> {
    const webhook = await this.webhookRepository.findOne({ where: { id } });

    if (webhook && webhook.status === 'ENABLED') {
      webhookService.send({ type: 'TRIGGER' } as WebhookEvent);

      const urls = webhook.urls || [];

      for (const url of urls) {
        const populatedUrl = url.replace(
          /{{(.*?)}}/g,
          (_, key) => data[key.trim()] || '',
        );

        //console.log('populatedUrl: ', populatedUrl);

        await axios.post(populatedUrl, data);
      }
    } else {
      throw new Error('Webhook is not enabled or not found');
    }
  }
  async findOne(id: number): Promise<Webhook> {
    try {
      return await this.webhookRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new Error(`Webhook with ID ${id} not found.`);
    }
  }

  async findAll(): Promise<Webhook[]> {
    return await this.webhookRepository.find();
  }

  async update(id: number, webhookData: UpdateWebhookDto): Promise<Webhook> {
    try {
      const existingWebhook = await this.webhookRepository.findOneOrFail({
        where: { id },
      });
      await this.webhookRepository.update(id, webhookData);
      return { ...existingWebhook, ...webhookData };
    } catch (error) {
      throw new Error(
        `Webhook with ID ${id} not found or could not be updated.`,
      );
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.webhookRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Webhook with ID ${id} not found. Cannot delete.`);
    }
  }

  async triggerWithQueue(id: number, data: Record<string, any>): Promise<void> {
    const webhook = await this.webhookRepository.findOne({ where: { id } });

    if (!webhook) {
      throw new Error(`Webhook with ID ${id} not found.`);
    }

    if (webhook.status !== 'ENABLED') {
      throw new Error(`Webhook with ID ${id} is not enabled.`);
    }

    console.log('Adding webhookQueue job to the queue');
    await this.queue.add(
      'webhookQueue',
      { webhook, data },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
    console.log('Job added to the queue successfully');
  }
  // async getQueueStatus() {
  //   const jobs = await this.queue.getJobs([
  //     'active',
  //     'waiting',
  //     // 'delayed',
  //     // 'failed',
  //     // 'paused',
  //   ]);
  //   return { jobs };
  // }
}
