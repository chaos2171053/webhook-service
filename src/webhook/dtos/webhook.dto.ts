import { IsString, IsArray } from 'class-validator';

export class CreateWebhookDto {
  // The name of the webhook, must be a string
  @IsString()
  name: string;

  // An array of URLs associated with the webhook, must be an array of strings
  @IsArray()
  urls: string[];
}

export class UpdateWebhookDto {
  // The new name of the webhook, optional and must be a string if provided
  @IsString()
  name?: string;

  // An array of updated URLs for the webhook, optional and must be an array of strings if provided
  @IsArray()
  urls?: string[];
}
