import swaggerJSDoc, { type Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "QuoteMatic API",
      version: "1.0.0",
      description:
        "Documentacion OpenAPI para QuoteMatic: API REST de frases, catalogos, auth y favoritos.",
    },
    servers: [
      {
        url: "https://quotematic.davlos.es",
        description: "Demo VPS (produccion)",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor local de desarrollo",
      },
    ],
    tags: [
      { name: "Base", description: "Salud y estado de la aplicacion" },
      { name: "Auth", description: "Registro, login, logout y sesion" },
      { name: "Catalogs", description: "Catalogos publicos" },
      { name: "Quotes", description: "Frases y CRUD protegido" },
      { name: "Favorites", description: "Favoritos del usuario autenticado" },
      { name: "My Quotes", description: "Frases privadas del usuario autenticado" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
          description: "Sesion Express persistida en MongoDB.",
        },
      },
      schemas: {
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Authentication required" },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "INVALID_CREDENTIALS" },
              },
            },
          },
        },
        ApiAuthSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "662f00000000000000000006" },
                    role: { type: "string", example: "user" },
                    ageGroup: { type: "string", example: "adult_18_plus" },
                  },
                },
              },
            },
          },
        },
        ApiMeResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            authenticated: { type: "boolean", example: true },
            data: {
              nullable: true,
              type: "object",
              properties: {
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "662f00000000000000000006" },
                    role: { type: "string", example: "user" },
                    ageGroup: { type: "string", example: "adult_18_plus" },
                  },
                },
              },
            },
          },
        },
        Author: {
          type: "object",
          properties: {
            _id: { type: "string", example: "662f00000000000000000001" },
            name: { type: "string", example: "Marco Aurelio" },
            authorType: { type: "string", example: "historical" },
            sourceWork: { type: "string", example: "Meditaciones" },
            isActive: { type: "boolean", example: true },
          },
        },
        Situation: {
          type: "object",
          properties: {
            _id: { type: "string", example: "662f00000000000000000002" },
            name: { type: "string", example: "Trabajo" },
            slug: { type: "string", example: "trabajo" },
            description: {
              type: "string",
              example: "Frases para afrontar retos laborales.",
            },
            isActive: { type: "boolean", example: true },
          },
        },
        QuoteType: {
          type: "object",
          properties: {
            _id: { type: "string", example: "662f00000000000000000003" },
            name: { type: "string", example: "Estoica" },
            slug: { type: "string", example: "stoic" },
            description: {
              type: "string",
              example: "Frases centradas en autocontrol, perspectiva y virtud.",
            },
            contentRating: { type: "string", example: "all" },
            isActive: { type: "boolean", example: true },
          },
        },
        Quote: {
          type: "object",
          properties: {
            _id: { type: "string", example: "662f00000000000000000004" },
            text: {
              type: "string",
              example: "Tienes poder sobre tu mente, no sobre los acontecimientos externos.",
            },
            textNormalized: {
              type: "string",
              example: "tienes poder sobre tu mente, no sobre los acontecimientos externos.",
            },
            author: { $ref: "#/components/schemas/Author" },
            situation: { $ref: "#/components/schemas/Situation" },
            quoteType: { $ref: "#/components/schemas/QuoteType" },
            language: { type: "string", example: "es" },
            contentRating: { type: "string", example: "all" },
            sourceType: { type: "string", example: "book" },
            sourceReference: { type: "string", example: "Meditaciones" },
            verificationStatus: { type: "string", example: "pending" },
            isActive: { type: "boolean", example: true },
          },
        },
        Favorite: {
          type: "object",
          properties: {
            _id: { type: "string", example: "662f00000000000000000005" },
            user: { type: "string", example: "662f00000000000000000006" },
            quote: { $ref: "#/components/schemas/Quote" },
            isActive: { type: "boolean", example: true },
          },
        },
        UserSession: {
          type: "object",
          properties: {
            authenticated: { type: "boolean", example: true },
            user: {
              type: "object",
              properties: {
                userId: { type: "string", example: "662f00000000000000000006" },
                role: { type: "string", example: "user" },
                ageGroup: { type: "string", example: "adult_18_plus" },
              },
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "ageRange"],
          properties: {
            name: { type: "string", example: "David" },
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "password123" },
            ageRange: { type: "string", example: "adult_18_plus" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "password123" },
          },
        },
        CreateQuoteRequest: {
          type: "object",
          required: [
            "text",
            "author",
            "situation",
            "quoteType",
            "language",
            "contentRating",
            "verificationStatus",
          ],
          properties: {
            text: { type: "string", example: "Frase de prueba desde Swagger" },
            author: { type: "string", example: "AUTHOR_ID" },
            situation: { type: "string", example: "SITUATION_ID" },
            quoteType: { type: "string", example: "QUOTE_TYPE_ID" },
            language: { type: "string", example: "es" },
            contentRating: { type: "string", example: "all" },
            verificationStatus: { type: "string", example: "pending" },
            sourceType: { type: "string", example: "original" },
            sourceReference: { type: "string", example: "Swagger" },
          },
        },
        UpdateQuoteRequest: {
          type: "object",
          properties: {
            text: { type: "string", example: "Frase actualizada desde Swagger" },
            contentRating: { type: "string", example: "teen" },
            verificationStatus: { type: "string", example: "manual_verified" },
            sourceType: { type: "string", example: "original" },
            sourceReference: { type: "string", example: "Swagger" },
          },
        },
        UserQuote: {
          type: "object",
          properties: {
            _id: { type: "string", example: "662f00000000000000000010" },
            text: { type: "string", example: "Mi frase privada" },
            textNormalized: { type: "string", example: "mi frase privada" },
            authorText: { type: "string", example: "Yo mismo" },
            situation: { $ref: "#/components/schemas/Situation" },
            quoteType: { $ref: "#/components/schemas/QuoteType" },
            language: { type: "string", example: "es" },
            contentRating: { type: "string", example: "all" },
            sourceType: { type: "string", example: "original" },
            sourceReference: { type: "string", example: "Mi diario" },
            ownerUserId: { type: "string", example: "662f00000000000000000006" },
            isActive: { type: "boolean", example: true },
          },
        },
        CreateUserQuoteRequest: {
          type: "object",
          required: ["text"],
          properties: {
            text: { type: "string", example: "Mi frase privada" },
            authorText: { type: "string", example: "Yo mismo", maxLength: 200 },
            situation: { type: "string", example: "trabajo", description: "Slug de Situation activa" },
            quoteType: { type: "string", example: "motivational", description: "Slug de QuoteType activo" },
            language: { type: "string", example: "es" },
            contentRating: { type: "string", enum: ["all", "teen", "adult"], example: "all" },
            sourceType: {
              type: "string",
              enum: ["book", "movie", "tv_show", "historical", "original", "unknown"],
              example: "original",
            },
            sourceReference: { type: "string", example: "Mi diario" },
          },
        },
        UpdateUserQuoteRequest: {
          type: "object",
          properties: {
            text: { type: "string", example: "Texto actualizado" },
            authorText: { type: "string", example: "Otro autor", maxLength: 200 },
            situation: { type: "string", example: "estres", description: "Slug de Situation activa" },
            quoteType: { type: "string", example: "stoic", description: "Slug de QuoteType activo" },
            language: { type: "string", example: "en" },
            contentRating: { type: "string", enum: ["all", "teen", "adult"], example: "teen" },
            sourceType: { type: "string", example: "book" },
            sourceReference: { type: "string", example: "Libro de cabecera" },
          },
        },
        BulkQuoteItem: {
          type: "object",
          required: ["text", "authorName", "situationSlug", "quoteTypeSlug"],
          properties: {
            text: { type: "string", example: "Tienes poder sobre tu mente..." },
            authorName: { type: "string", example: "Marco Aurelio" },
            authorType: { type: "string", enum: ["real", "historical", "fictional", "unknown"], example: "historical" },
            situationSlug: { type: "string", example: "trabajo" },
            quoteTypeSlug: { type: "string", example: "stoic" },
            language: { type: "string", example: "es", default: "es" },
            contentRating: { type: "string", enum: ["all", "teen", "adult"], example: "all", default: "all" },
            verificationStatus: {
              type: "string",
              enum: ["original", "pending", "manual_verified", "rejected", "disputed"],
              example: "pending",
              default: "pending",
            },
            sourceType: {
              type: "string",
              enum: ["book", "movie", "tv_show", "historical", "original", "unknown"],
              example: "book",
              default: "unknown",
            },
            sourceReference: { type: "string", example: "Meditaciones" },
          },
        },
        BulkCreateQuotesRequest: {
          type: "object",
          required: ["quotes"],
          properties: {
            quotes: {
              type: "array",
              minItems: 1,
              maxItems: 500,
              items: { $ref: "#/components/schemas/BulkQuoteItem" },
            },
          },
        },
        BulkCreateQuotesResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                total: { type: "integer", example: 50 },
                imported: { type: "integer", example: 47 },
                skipped: { type: "integer", example: 3 },
                errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      row: { type: "integer", example: 5 },
                      text: { type: "string", example: "Frase duplicada..." },
                      message: { type: "string", example: "Frase duplicada para este autor" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      "/health": {
        get: {
          tags: ["Base"],
          summary: "Comprueba el estado del servidor",
          responses: {
            "200": {
              description: "Servidor operativo",
            },
          },
        },
      },
      "/auth/register": {
        get: {
          tags: ["Auth"],
          summary: "Renderiza el formulario de registro",
          responses: {
            "200": { description: "Vista EJS de registro" },
          },
        },
        post: {
          tags: ["Auth"],
          summary: "Registra un usuario",
          requestBody: {
            required: true,
            content: {
              "application/x-www-form-urlencoded": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            "302": { description: "Usuario creado y redireccion a login" },
            "400": { description: "Datos invalidos" },
            "403": { description: "Menor de 14 no permitido" },
            "409": { description: "Email ya registrado" },
          },
        },
      },
      "/auth/login": {
        get: {
          tags: ["Auth"],
          summary: "Renderiza el formulario de login",
          responses: {
            "200": { description: "Vista EJS de login" },
          },
        },
        post: {
          tags: ["Auth"],
          summary: "Inicia sesion",
          requestBody: {
            required: true,
            content: {
              "application/x-www-form-urlencoded": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "302": { description: "Login correcto y cookie de sesion creada" },
            "401": { description: "Credenciales incorrectas" },
            "403": { description: "Usuario inactivo" },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Cierra sesion",
          security: [{ cookieAuth: [] }],
          responses: {
            "302": { description: "Sesion destruida y redireccion al inicio" },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Devuelve la sesion actual",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": {
              description: "Estado de autenticacion",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserSession" },
                },
              },
            },
            "401": { description: "Sesion requerida" },
          },
        },
      },
      "/auth/admin-check": {
        get: {
          tags: ["Auth"],
          summary: "Comprueba acceso admin",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": { description: "Usuario admin autorizado" },
            "401": { description: "Sesion requerida" },
            "403": { description: "Rol admin requerido" },
          },
        },
      },
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Registra un usuario y abre sesion (JSON)",
          description:
            "Crea el usuario, inicia sesion y devuelve la cookie connect.sid. Apto para clientes React/KMP.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Usuario creado y sesion iniciada",
              headers: {
                "Set-Cookie": {
                  description: "connect.sid — cookie de sesion httpOnly",
                  schema: { type: "string" },
                },
              },
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiAuthSuccess" },
                },
              },
            },
            "400": {
              description: "Campos obligatorios ausentes o ageRange invalido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "403": {
              description: "Registro de menores de 14 no permitido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "409": {
              description: "Email ya registrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "500": {
              description: "Error interno",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Inicia sesion y devuelve cookie (JSON)",
          description:
            "Valida credenciales, crea sesion en MongoDB y devuelve connect.sid en Set-Cookie. Usar con credentials: include en fetch.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Login correcto",
              headers: {
                "Set-Cookie": {
                  description: "connect.sid — cookie de sesion httpOnly",
                  schema: { type: "string" },
                },
              },
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiAuthSuccess" },
                },
              },
            },
            "400": {
              description: "Email o password ausentes",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "401": {
              description: "Credenciales incorrectas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "403": {
              description: "Usuario inactivo",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "500": {
              description: "Error interno",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Cierra sesion (JSON)",
          description: "Destruye la sesion en MongoDB y limpia la cookie connect.sid.",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": {
              description: "Sesion destruida",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { success: { type: "boolean", example: true } },
                  },
                },
              },
            },
            "401": {
              description: "Sesion requerida",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "500": {
              description: "Error interno",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Estado de sesion actual (JSON)",
          description:
            "No requiere autenticacion. Devuelve authenticated: false si no hay sesion activa.",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": {
              description: "Estado de autenticacion",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiMeResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/admin-check": {
        get: {
          tags: ["Auth"],
          summary: "Comprueba acceso admin (JSON)",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": {
              description: "Usuario admin autorizado",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string", example: "Admin access granted" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Sesion requerida",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "403": {
              description: "Rol admin requerido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
          },
        },
      },
      "/api/authors": {
        get: {
          tags: ["Catalogs"],
          summary: "Lista autores activos",
          responses: {
            "200": {
              description: "Autores activos",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Author" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/situations": {
        get: {
          tags: ["Catalogs"],
          summary: "Lista situaciones activas",
          responses: {
            "200": {
              description: "Situaciones activas",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Situation" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/quote-types": {
        get: {
          tags: ["Catalogs"],
          summary: "Lista tipos de frase activos",
          responses: {
            "200": {
              description: "Tipos de frase activos",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/QuoteType" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/quotes": {
        get: {
          tags: ["Quotes"],
          summary: "Lista frases activas con filtros y paginación",
          description:
            "Devuelve frases activas paginadas. Sin parámetros usa page=1 y limit=20. " +
            "Filtros por slug (situation, quoteType), ObjectId (author), enum (contentRating) y texto libre (search).",
          parameters: [
            {
              name: "situation",
              in: "query",
              required: false,
              description: "Slug de Situation activa. Ejemplo: trabajo, estres",
              schema: { type: "string", example: "trabajo" },
            },
            {
              name: "quoteType",
              in: "query",
              required: false,
              description: "Slug de QuoteType activo. Ejemplo: stoic, motivational",
              schema: { type: "string", example: "stoic" },
            },
            {
              name: "contentRating",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["all", "teen", "adult"] },
            },
            {
              name: "author",
              in: "query",
              required: false,
              description: "ObjectId MongoDB de Author activo",
              schema: { type: "string", example: "662f00000000000000000001" },
            },
            {
              name: "search",
              in: "query",
              required: false,
              description: "Texto libre (2–100 chars). Busca sobre el campo textNormalized.",
              schema: { type: "string", minLength: 2, maxLength: 100, example: "vida" },
            },
            {
              name: "page",
              in: "query",
              required: false,
              description: "Número de página (≥1). Default: 1",
              schema: { type: "integer", minimum: 1, default: 1, example: 1 },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              description: "Resultados por página (1–100). Default: 20",
              schema: { type: "integer", minimum: 1, maximum: 100, default: 20, example: 20 },
            },
          ],
          responses: {
            "200": {
              description: "Frases activas paginadas",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Quote" },
                      },
                      meta: {
                        type: "object",
                        properties: {
                          page: { type: "integer", example: 1 },
                          limit: { type: "integer", example: 20 },
                          total: { type: "integer", example: 156 },
                          totalPages: { type: "integer", example: 8 },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Parámetro inválido (page, limit, contentRating, search o author con formato incorrecto)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "404": {
              description: "Slug de situation o quoteType no encontrado, o author no encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Quotes"],
          summary: "Crea una frase",
          description: "Requiere sesion activa y rol admin.",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateQuoteRequest" },
              },
            },
          },
          responses: {
            "201": { description: "Frase creada" },
            "400": { description: "Payload o referencias invalidas" },
            "401": { description: "Sesion requerida" },
            "403": { description: "Rol admin requerido" },
          },
        },
      },
      "/api/quotes/bulk": {
        post: {
          tags: ["Quotes"],
          summary: "Importacion masiva de frases (admin)",
          description:
            "Importa hasta 500 frases en una sola peticion. " +
            "El autor se busca o crea por nombre. " +
            "Los slugs de situation y quoteType se resuelven contra catalogo activo. " +
            "Las filas que fallan se incluyen en errors[] sin abortar el resto. " +
            "Requiere sesion activa y rol admin.",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BulkCreateQuotesRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Importacion completada (parcial o total)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/BulkCreateQuotesResponse" },
                },
              },
            },
            "400": {
              description: "Body invalido (quotes no es array, vacio o supera 500)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "401": {
              description: "Sesion requerida",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "403": {
              description: "Rol admin requerido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
            "500": {
              description: "Error inesperado global",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiError" },
                },
              },
            },
          },
        },
      },
      "/api/quotes/random": {
        get: {
          tags: ["Quotes"],
          summary: "Devuelve una frase aleatoria activa",
          parameters: [
            {
              name: "contentRating",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["all", "teen", "adult"] },
            },
            {
              name: "quoteType",
              in: "query",
              required: false,
              schema: { type: "string", example: "stoic" },
            },
          ],
          responses: {
            "200": { description: "Frase aleatoria" },
            "404": { description: "No hay frases activas para el filtro" },
          },
        },
      },
      "/api/quotes/{id}": {
        get: {
          tags: ["Quotes"],
          summary: "Devuelve una frase activa por id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Frase encontrada" },
            "400": { description: "Id invalido" },
            "404": { description: "Frase no encontrada" },
          },
        },
        put: {
          tags: ["Quotes"],
          summary: "Actualiza parcialmente una frase",
          description: "Requiere sesion activa y rol admin.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateQuoteRequest" },
              },
            },
          },
          responses: {
            "200": { description: "Frase actualizada" },
            "400": { description: "Payload o id invalido" },
            "401": { description: "Sesion requerida" },
            "403": { description: "Rol admin requerido" },
            "404": { description: "Frase no encontrada" },
          },
        },
        delete: {
          tags: ["Quotes"],
          summary: "Borra logicamente una frase",
          description: "Requiere sesion activa y rol admin. Marca isActive=false.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Frase desactivada" },
            "400": { description: "Id invalido" },
            "401": { description: "Sesion requerida" },
            "403": { description: "Rol admin requerido" },
            "404": { description: "Frase no encontrada" },
          },
        },
      },
      "/api/favorites/me": {
        get: {
          tags: ["Favorites"],
          summary: "Lista favoritos activos del usuario autenticado",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": {
              description: "Favoritos activos",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Favorite" },
                      },
                    },
                  },
                },
              },
            },
            "401": { description: "Sesion requerida" },
          },
        },
      },
      "/api/favorites/{quoteId}": {
        post: {
          tags: ["Favorites"],
          summary: "Añade o reactiva una frase favorita",
          description:
            "Requiere sesion. Evita duplicados y reactiva favoritos inactivos.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "quoteId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "201": { description: "Favorito creado" },
            "200": { description: "Favorito existente o reactivado" },
            "400": { description: "Id invalido" },
            "401": { description: "Sesion requerida" },
            "404": { description: "Quote no encontrada" },
          },
        },
        delete: {
          tags: ["Favorites"],
          summary: "Quita una frase de favoritos",
          description: "Requiere sesion. Usa borrado logico con isActive=false.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "quoteId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Favorito desactivado" },
            "400": { description: "Id invalido" },
            "401": { description: "Sesion requerida" },
            "404": { description: "Favorito activo no encontrado" },
          },
        },
      },
      "/api/me/quotes": {
        get: {
          tags: ["My Quotes"],
          summary: "Lista frases privadas del usuario autenticado",
          description:
            "Devuelve frases privadas paginadas del usuario en sesión. " +
            "Filtros opcionales por situation (slug), quoteType (slug), contentRating y search.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "situation",
              in: "query",
              required: false,
              schema: { type: "string", example: "trabajo" },
              description: "Slug de Situation activa",
            },
            {
              name: "quoteType",
              in: "query",
              required: false,
              schema: { type: "string", example: "stoic" },
              description: "Slug de QuoteType activo",
            },
            {
              name: "contentRating",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["all", "teen", "adult"] },
            },
            {
              name: "search",
              in: "query",
              required: false,
              schema: { type: "string", minLength: 2, maxLength: 100, example: "vida" },
              description: "Texto libre (2–100 chars)",
            },
            {
              name: "page",
              in: "query",
              required: false,
              schema: { type: "integer", minimum: 1, default: 1 },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
            },
          ],
          responses: {
            "200": {
              description: "Frases privadas paginadas",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { type: "array", items: { $ref: "#/components/schemas/UserQuote" } },
                      meta: {
                        type: "object",
                        properties: {
                          page: { type: "integer", example: 1 },
                          limit: { type: "integer", example: 20 },
                          total: { type: "integer", example: 5 },
                          totalPages: { type: "integer", example: 1 },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Parámetro inválido",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
            "401": {
              description: "Sesión requerida",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
            "404": {
              description: "Slug de situation o quoteType no encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
          },
        },
        post: {
          tags: ["My Quotes"],
          summary: "Crea una frase privada",
          description: "Requiere sesión. ownerUserId siempre sale de la sesión.",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateUserQuoteRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Frase privada creada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/UserQuote" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Payload inválido o slug no encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
            "401": {
              description: "Sesión requerida",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
            "404": {
              description: "Slug de situation o quoteType no encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
            "409": {
              description: "Ya existe una frase con ese texto para este usuario",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
            "500": {
              description: "Error interno",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
          },
        },
      },
      "/api/me/quotes/random": {
        get: {
          tags: ["My Quotes"],
          summary: "Devuelve una frase privada aleatoria del usuario",
          description: "Acepta los mismos filtros opcionales que GET /api/me/quotes.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "situation",
              in: "query",
              required: false,
              schema: { type: "string", example: "trabajo" },
            },
            {
              name: "quoteType",
              in: "query",
              required: false,
              schema: { type: "string", example: "stoic" },
            },
            {
              name: "contentRating",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["all", "teen", "adult"] },
            },
          ],
          responses: {
            "200": {
              description: "Frase privada aleatoria",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/UserQuote" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Sesión requerida",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
            "404": {
              description: "No hay frases activas para el filtro",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
            },
          },
        },
      },
      "/api/me/quotes/{id}": {
        get: {
          tags: ["My Quotes"],
          summary: "Devuelve una frase privada por id",
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Frase privada encontrada" },
            "400": { description: "Id inválido" },
            "401": { description: "Sesión requerida" },
            "404": { description: "Frase no encontrada o no pertenece al usuario" },
          },
        },
        put: {
          tags: ["My Quotes"],
          summary: "Actualiza parcialmente una frase privada",
          description: "Requiere sesión. Solo el propietario puede editar. ownerUserId no se acepta en el body.",
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateUserQuoteRequest" },
              },
            },
          },
          responses: {
            "200": { description: "Frase privada actualizada" },
            "400": { description: "Payload o id inválido" },
            "401": { description: "Sesión requerida" },
            "404": { description: "Frase no encontrada o no pertenece al usuario" },
            "409": { description: "Texto duplicado para este usuario" },
            "500": { description: "Error interno" },
          },
        },
        delete: {
          tags: ["My Quotes"],
          summary: "Borra lógicamente una frase privada",
          description: "Requiere sesión. Solo el propietario puede borrar. Marca isActive=false.",
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Frase privada desactivada" },
            "400": { description: "Id inválido" },
            "401": { description: "Sesión requerida" },
            "404": { description: "Frase no encontrada o no pertenece al usuario" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
