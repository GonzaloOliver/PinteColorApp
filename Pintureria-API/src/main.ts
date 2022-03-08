import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PricelistService } from './pricelist/pricelist.service';
import { SettingsService } from './settings/settings.service';
import { CitiesService } from './shared/location/cities/cities.service';
import { ProvincesService } from './shared/location/provinces/provinces.service';
import { StoresService } from './stores/stores.service';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const storesService = app.get(StoresService);
  const usersService = app.get(UsersService);
  const settingsService = app.get(SettingsService);
  const provincesService = app.get(ProvincesService);
  const citiesService = app.get(CitiesService);
  const pricelistService = app.get(PricelistService);

  app.setGlobalPrefix(configService.get('APP_GLOBAL_PREFIX'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    allowedHeaders: ['Origin', 'Accept', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Content-Type'],
    credentials: true,
    origin: '*',
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  });

  if (configService.get('ENV') == 'dev') {
    const config = new DocumentBuilder()
      .setTitle('Pintureria API')
      .setDescription('API for Pintureria')
      .setVersion('0.1')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      explorer: true,
    });
  }

  await app.listen(configService.get('PORT'));

  await provincesService.initDB();
  await citiesService.initDB();
  await storesService.initDB();
  await usersService.initDB();
  await settingsService.initDB();
  await pricelistService.initDB();
}
bootstrap();
