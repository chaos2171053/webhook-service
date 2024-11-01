import { IsEnum } from 'class-validator';

export enum WebhookStatus {
  ENABLED = 'ENABLED', // the webhook is enabled
  DISABLED = 'DISABLED', // the webhook is disabled
}

export class UpdateStatusDto {
  // Status to be updated, must be one of the values defined in the WebhookStatus enum
  @IsEnum(WebhookStatus)
  status: WebhookStatus;
}
