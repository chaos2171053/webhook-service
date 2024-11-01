import {
  Processor,
  WorkerHost,
  OnWorkerEvent,
  OnQueueEvent,
} from '@nestjs/bullmq';
import axios from 'axios';
import { Job } from 'bullmq';

@Processor('webhookQueue')
export class WebhookProcessor extends WorkerHost {
  constructor() {
    super();
    console.log('WebhookProcessor instantiated');
  }

  async process(job: Job): Promise<void> {
    console.log(`Processing job with ID: ${job.id}`);
    const { webhook, data } = job.data;

    if (!webhook || !Array.isArray(webhook.urls)) {
      throw new Error('Invalid webhook data.');
    }

    for (const url of webhook.urls) {
      const populatedUrl = url.replace(
        /{{(.*?)}}/g,
        (_, key) => data[key.trim()] || '',
      );

      console.log('Sending to:', populatedUrl);

      try {
        await axios.post(populatedUrl, data);
        console.log(`Successfully sent data to: ${populatedUrl}`);
      } catch (error) {
        console.error(`Failed to send data to ${populatedUrl}:`, error.message);
      }
    }
  }
  @OnQueueEvent('active')
  onQueueEventActive(job: { jobId: string; prev?: string }) {
    console.log(`Processing job ${job.jobId}...`);
  }
  @OnWorkerEvent('completed')
  onJobCompleted(job: Job) {
    console.log(`Job ${job.id} completed successfully.`);
  }

  @OnWorkerEvent('failed')
  onJobFailed(job: Job, err: Error) {
    console.log(`Job ${job.id} failed with error: ${err.message}`);
  }
}
