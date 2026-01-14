export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Express TypeScript API',
    version: '1.0.0',
    description: 'Simple CRUD API built with Express + TypeScript + SQLite (Kysely)',
    contact: {
      name: 'API Support',
      url: 'https://example.com/support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    { url: '/api', description: 'Relative (same host)' },
    { url: 'http://localhost:3000/api', description: 'Local dev' },
  ],
  externalDocs: {
    description: 'Project repository',
    url: 'https://example.com/repo',
  },
  tags: [
    { name: 'Health', description: 'Service status' },
    { name: 'Users', description: 'User CRUD with id/uuid access' },
  ],
  paths: {
    '/v1/health': {
      get: {
        summary: 'Health check',
        tags: ['Health'],
        responses: {
          200: {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    ts: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/users': {
      get: {
        summary: 'List users',
        tags: ['Users'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number (1-based)',
          },
          {
            name: 'pageSize',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            description: 'Items per page (max 100)',
          },
        ],
        responses: {
          200: {
            description: 'Paginated users',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaginatedUsers',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create user',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserInput' },
              examples: {
                default: {
                  summary: 'New user',
                  value: { name: 'Grace Hopper', email: 'grace@example.com' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created user',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/v1/users/{id}': {
      get: {
        summary: 'Get user by id',
        tags: ['Users'],
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: {
            description: 'User',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
      put: {
        summary: 'Update user',
        tags: ['Users'],
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' },
              examples: {
                changeName: {
                  summary: 'Change name',
                  value: { name: 'Grace M. Hopper' },
                },
                changeEmail: {
                  summary: 'Change email',
                  value: { email: 'grace.h@example.com' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated user',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
      delete: {
        summary: 'Delete user',
        tags: ['Users'],
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          204: { description: 'Deleted' },
          404: { $ref: '#/components/responses/NotFound' },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          uuid: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          created_at: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'uuid', 'name', 'email', 'created_at'],
        example: {
          id: 1,
          uuid: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          created_at: '2024-01-01T00:00:00.000Z',
        },
      },
      CreateUserInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'Grace Hopper' },
          email: { type: 'string', format: 'email', example: 'grace@example.com' },
        },
      },
      UpdateUserInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Grace Hopper' },
          email: { type: 'string', format: 'email', example: 'grace@example.com' },
        },
        description: 'At least one field required',
      },
      PaginatedUsers: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
          page: { type: 'integer', example: 1 },
          pageSize: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 42 },
          totalPages: { type: 'integer', example: 5 },
        },
      },
    },
    parameters: {
      UserId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Numeric id or UUID',
        schema: {
          type: 'string',
          pattern: '^(\\d+|[0-9a-fA-F-]{36})$',
        },
      },
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' },
                message: { type: 'string' },
              },
              example: { error: 'NotFound', message: 'User not found' },
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' },
                message: { type: 'string' },
              },
              example: { error: 'ValidationError', message: 'email: Invalid email' },
            },
          },
        },
      },
      Conflict: {
        description: 'Unique constraint violation (email/uuid)',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' },
                message: { type: 'string' },
              },
              example: { error: 'Conflict', message: 'Email already exists' },
            },
          },
        },
      },
    },
  },
};
