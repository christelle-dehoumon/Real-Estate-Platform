"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Fasohabitat API',
        version: '1.0.0',
        description: 'API Documentation for the Fullstack Real Estate Platform'
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    paths: {
        '/api/auth/register': {
            post: {
                summary: 'Cr\u00e9er un compte utilisateur',
                tags: ['Authentication'],
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Jean Dupont' },
                                    email: { type: 'string', example: 'jean@example.com' },
                                    password: { type: 'string', example: 'password123' },
                                    role: { type: 'string', enum: ['buyer', 'owner'], example: 'buyer' },
                                    phone: { type: 'string', example: '+33612345678' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Utilisateur cr\u00e9\u00e9 avec succ\u00e8s' }
                }
            }
        },
        '/api/auth/login': {
            post: {
                summary: 'Se connecter',
                tags: ['Authentication'],
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'jean@example.com' },
                                    password: { type: 'string', example: 'password123' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Connexion r\u00e9ussie (retourne un Token JWT)' }
                }
            }
        },
        '/api/auth/profile': {
            get: {
                summary: 'Obtenir le profil connect\u00e9',
                tags: ['Authentication'],
                responses: {
                    '200': { description: 'Donn\u00e9es du profil' }
                }
            },
            put: {
                summary: 'Mettre \u00e0 jour le profil',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    phone: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Profil mis \u00e0 jour' }
                }
            },
            delete: {
                summary: 'Supprimer mon compte utilisateur',
                tags: ['Authentication'],
                responses: {
                    '200': { description: 'Compte supprim\u00e9' }
                }
            }
        },
        '/api/properties': {
            get: {
                summary: 'Lister toutes les propri\u00e9t\u00e9s',
                tags: ['Properties'],
                security: [],
                responses: {
                    '200': { description: 'Liste des propri\u00e9t\u00e9s' }
                }
            },
            post: {
                summary: 'Publier une nouvelle propri\u00e9t\u00e9',
                tags: ['Properties'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string', example: 'Villa sur la cot\u00e9' },
                                    description: { type: 'string' },
                                    price: { type: 'number', example: 2500000 },
                                    transactionType: { type: 'string', enum: ['rent', 'sell'], example: 'sell' },
                                    location: {
                                        type: 'object',
                                        properties: {
                                            address: { type: 'string' },
                                            city: { type: 'string', example: 'Cannes' },
                                            country: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Propri\u00e9t\u00e9 cr\u00e9\u00e9e' }
                }
            }
        },
        '/api/properties/{id}': {
            get: {
                summary: 'D\u00e9tails d\'une propri\u00e9t\u00e9',
                tags: ['Properties'],
                security: [],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'D\u00e9tails de la propri\u00e9t\u00e9' }
                }
            },
            put: {
                summary: 'Modifier une propri\u00e9t\u00e9',
                tags: ['Properties'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    price: { type: 'number' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Propri\u00e9t\u00e9 modifi\u00e9e' }
                }
            },
            delete: {
                summary: 'Supprimer une propri\u00e9t\u00e9',
                tags: ['Properties'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Propri\u00e9t\u00e9 supprim\u00e9e' }
                }
            }
        },
        '/api/messages': {
            post: {
                summary: 'Envoyer un message \u00e0 un propri\u00e9taire',
                tags: ['Messages'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    receiverId: { type: 'string' },
                                    propertyId: { type: 'string' },
                                    content: { type: 'string', example: 'Bonjour, la villa est-elle toujours dispo ?' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Message envoy\u00e9' }
                }
            },
            get: {
                summary: 'Lister les derni\u00e8res conversations',
                tags: ['Messages'],
                responses: {
                    '200': { description: 'Liste des boites de r\u00e9ception' }
                }
            }
        },
        '/api/messages/{id}': {
            delete: {
                summary: 'Supprimer un message',
                tags: ['Messages'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Message supprim\u00e9' }
                }
            }
        },
        '/api/messages/{userId}': {
            get: {
                summary: 'Ouvrir une conversation sp\u00e9cifique',
                tags: ['Messages'],
                parameters: [
                    { name: 'userId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Historique des messages' }
                }
            }
        },
        '/api/supervision/reports': {
            get: {
                summary: 'Voir les signalements (Supervision)',
                tags: ['Supervision'],
                responses: {
                    '200': { description: 'Liste des signalements' }
                }
            }
        },
        '/api/supervision/block/{propertyId}': {
            put: {
                summary: 'Bloquer une annonce signal\u00e9e (Supervision)',
                tags: ['Supervision'],
                parameters: [
                    { name: 'propertyId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Annonce bloqu\u00e9e' }
                }
            }
        },
        '/api/supervision/report/{id}': {
            delete: {
                summary: 'Supprimer un signalement trait\u00e9 (Supervision)',
                tags: ['Supervision'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Signalement supprim\u00e9' }
                }
            }
        },
        '/api/supervision/users': {
            get: {
                summary: 'Lister tous les utilisateurs (Supervision)',
                tags: ['Supervision'],
                responses: {
                    '200': { description: 'Liste des utilisateurs' }
                }
            }
        },
        '/api/supervision/users/{id}': {
            delete: {
                summary: 'Supprimer un utilisateur (Supervision)',
                tags: ['Supervision'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Utilisateur supprim\u00e9' }
                }
            }
        },
        '/api/supervision/stats': {
            get: {
                summary: 'Statistiques globales (Supervision)',
                tags: ['Supervision'],
                responses: {
                    '200': { description: 'Statistiques r\u00e9cup\u00e9r\u00e9es' }
                }
            }
        },
        '/api/favorites': {
            post: {
                summary: 'Ajouter une annonce aux favoris',
                tags: ['Favorites'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    propertyId: { type: 'string', example: 'PROPRETY_ID_HERE' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Ajout\u00e9 aux favoris' }
                }
            },
            get: {
                summary: 'Lister mes annonces favorites',
                tags: ['Favorites'],
                responses: {
                    '200': { description: 'Liste des favoris' }
                }
            }
        },
        '/api/favorites/{propertyId}': {
            delete: {
                summary: 'Retirer une annonce des favoris',
                tags: ['Favorites'],
                parameters: [
                    { name: 'propertyId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Retir\u00e9 des favoris' }
                }
            }
        }
    }
};
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
};
exports.setupSwagger = setupSwagger;
