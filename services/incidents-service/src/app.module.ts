import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { redisConfig } from './config/redis';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({ redis: redisConfig }),
    IncidentsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
