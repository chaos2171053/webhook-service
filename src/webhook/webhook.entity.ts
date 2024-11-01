import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Webhook {
  // Unique identifier for the webhook, auto-generated
  @PrimaryGeneratedColumn()
  id: number;

  // The name of the webhook
  @Column()
  name: string;

  // Indicates whether the webhook is enabled, defaults to true
  @Column({ default: true })
  enabled: boolean;

  // The current status of the webhook, defaults to 'CREATED'
  @Column({ default: 'CREATED' })
  status: string;

  // An array of URLs associated with the webhook, stored as JSON
  @Column({ type: 'json' })
  urls: string[];
}
