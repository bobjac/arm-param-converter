import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DeploymentController } from './controller/deployment.controller';
import { MarketplaceSettingsController } from './controller/marketplacesettings.controller';
import { join } from 'path';
import { AppController } from './app.controller';
import { DeploymentService } from './service/deployment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [DeploymentController, MarketplaceSettingsController],
  providers: [
    DeploymentService
  ],
})
export class AppModule {}
