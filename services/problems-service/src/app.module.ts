import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProblemsModule } from './modules/problems/problems.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ProblemsModule],
})
export class AppModule {}
