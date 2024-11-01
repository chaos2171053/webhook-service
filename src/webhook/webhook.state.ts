import { createMachine, interpret, EventObject } from 'xstate';

// Define the possible events for the webhook state machine
type WebhookEvent =
  | { type: 'ENABLE' }
  | { type: 'DISABLE' }
  | { type: 'TRIGGER' };

const webhookMachine = createMachine({
  id: 'webhook',
  initial: 'CREATED',
  states: {
    // Transitions from CREATED state
    CREATED: {
      on: {
        ENABLE: 'ENABLED',
        DISABLE: 'DISABLED',
      },
    },
    // Transitions from ENABLED state
    ENABLED: {
      on: {
        TRIGGER: 'TRIGGERED',
        DISABLE: 'DISABLED',
      },
    },
    // Transitions from DISABLED state
    DISABLED: {
      on: {
        ENABLE: 'ENABLED',
      },
    },
    TRIGGERED: {
      // Transitions from TRIGGERED state
      on: {
        DISABLE: 'DISABLED',
      },
    },
  },
});

const webhookService = interpret(webhookMachine).start();

export { webhookService, WebhookEvent };
