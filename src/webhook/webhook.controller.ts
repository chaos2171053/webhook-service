import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Webhook } from './webhook.entity';
import ResponseTransformInterceptor from '../utils/response.interceptor';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateWebhookDto, UpdateWebhookDto } from './dtos/webhook.dto';
import { UpdateStatusDto } from './dtos/updateStatus.dto';

@ApiTags('webhooks')
@Controller('webhooks')
@UseInterceptors(ResponseTransformInterceptor)
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new webhook' })
  @ApiBody({
    description: 'Webhook data',
    type: CreateWebhookDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The webhook has been successfully created.',
  })
  @HttpCode(200)
  async create(@Body() webhookData: CreateWebhookDto): Promise<Webhook> {
    return this.webhookService.create(webhookData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a webhook by ID' })
  @ApiResponse({
    status: 200,
    description: 'The webhook has been successfully retrieved.',
  })
  @HttpCode(200)
  async findOne(@Param('id') id: number): Promise<Webhook> {
    return this.webhookService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all webhooks' })
  @ApiResponse({
    status: 200,
    description: 'The list of webhooks has been successfully retrieved.',
  })
  @HttpCode(200)
  async findAll(): Promise<Webhook[]> {
    return this.webhookService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a webhook by ID' })
  @ApiBody({
    description: 'Updated webhook data',
    type: UpdateWebhookDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The webhook has been successfully updated.',
  })
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() webhookData: UpdateWebhookDto,
  ): Promise<Webhook> {
    return this.webhookService.update(id, webhookData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a webhook by ID' })
  @ApiResponse({
    status: 200,
    description: 'The webhook has been successfully deleted.',
  })
  @HttpCode(200)
  async remove(@Param('id') id: number): Promise<void> {
    return this.webhookService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Enable or disable a webhook by ID' })
  @ApiResponse({
    status: 200,
    description: 'The webhook status has been updated.',
  })
  @ApiResponse({ status: 404, description: 'Webhook not found.' })
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return await this.webhookService.updateStatus(id, updateStatusDto);
  }

  @Post(':id/trigger')
  @ApiOperation({ summary: 'Trigger a webhook by ID' })
  @ApiParam({ name: 'id', description: 'ID of the webhook to trigger' })
  @ApiBody({
    description: 'Data to send with the webhook',
    type: Object,
  })
  @HttpCode(200)
  async trigger(
    @Param('id') id: number,
    @Body() data: Record<string, any>,
  ): Promise<void> {
    return this.webhookService.trigger(id, data);
  }
}
