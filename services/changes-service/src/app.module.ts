import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChangesModule } from './modules/changes/changes.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ChangesModule],
})
export class AppModule {}
