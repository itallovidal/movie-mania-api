import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import * as yaml from 'yamljs'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const swaggerDocument = fs.readFileSync('./swagger.yaml', 'utf8')
  const document = SwaggerModule.createDocument(
    app,
    yaml.parse(swaggerDocument),
  )
  SwaggerModule.setup('swagger', app, document)
  app.enableCors()
  await app.listen(3333)
}
bootstrap()
