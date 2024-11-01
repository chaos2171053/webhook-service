# Webhook Service

## Tech Stack

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5) that supports various SQL databases.
- **MySQL**: A relational database management system.
- **XState**: A library for creating, interpreting, and executing finite state machines and statecharts.
- **Swagger**: A tool for documenting APIs, allowing for easy testing of endpoints.

## Getting Started

### Prerequisites

- Docker
- Node.js (version 16.18.0 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chaos2171053/webhook-service.git
   cd webhook-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the MySQL database using Docker:

   ```bash
   docker compose up --build
   ```

4. Run the application:

   ```bash
   npm run start
   ```

## Using Swagger to Test the Project

1. Once the server is running, open your browser and navigate to `http://localhost:9706/api`.

2. You will see the Swagger UI where you can explore the API endpoints.

3. You can test the following endpoints:

   - **POST /webhooks**: Create a new webhook. Provide a JSON body with `name` and `urls`.

     ```json
     {
       "name": "webhook1",
       "urls": [
         "https://www.google.com/?user={{userId}}&message={{message}}",
         "https://www.google.com/search?q={{searchTerm}}"
       ]
     }
     ```

   - **GET /webhooks**: Retrieve all webhooks.
   - **GET /webhooks/:id**: Retrieve a specific webhook by ID.
   - **PATCH /webhooks/:id/status**: Update the status of a webhook. Provide a JSON body with the `status` to set it to either `ENABLED` or `DISABLED`.

     ```json
     {
       "status": "ENABLED"
     }
     ```

   - **PUT /webhooks/:id**: Update an existing webhook. Provide a JSON body with the updated `name` and/or `urls`.

   ```json
   {
     "name": "webhook1",
     "urls": [
       "https://www.google.com/?userId={{userId}}&message={{message}}",
       "https://www.google.com/search?searchTerm={{searchTerm}}"
     ]
   }
   ```

   - **DELETE /webhooks/:id**: Delete a webhook by ID.
   - **POST /webhooks/:id/trigger**: Trigger the webhook execution using the specified ID.

     ```json
     {
       "userId": "123",
       "message": "Hello, World!",
       "searchTerm": "ok"
     }
     ```

   - **POST /webhooks/:id/trigger-with-queue**: Triggers a webhook using a message queue.

   ```json
   {
     "userId": "123",
     "message": "Hello, World!",
     "searchTerm": "ok"
   }
   ```

## Project Directory Structure

```bash
.
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── utils
│   │   ├── exceptions.filters.ts // handle error cases
│   │   └── response.interceptor.ts // handle responses
│   └── webhook // webhook module
│       ├── dtos
│       │   ├── updateStatus.dto.ts
│       │   └── webhook.dto.ts
│       ├── webhook.controller.ts
│       ├── webhook.entity.ts
│       ├── webhook.module.ts
│       ├── webhook.processor.ts  // use message queue to handle request
│       ├── webhook.service.ts
│       └── webhook.state.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```
