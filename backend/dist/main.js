"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('P2P Crypto Trading ')
        .setDescription('A Platform for sellers and buyers to connect directly')
        .setVersion('beta')
        .addTag('Blockchain')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    app.enableCors();
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map