import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly httpService: HttpService) {}

  @Cron('0 */3 * * * *') // Каждые 3 минуты
  async handleCron() {
    // const url = 'https://job-for-you-api.onrender.com/'; // Укажите ваш API-эндпоинт
    const url = 'http://localhost:3200';

    try {
      await this.httpService.axiosRef.get(url);
      this.logger.log(`Ping sent to ${url}`);
    } catch (error) {
      this.logger.error(`Failed to ping ${url}: ${error.message}`);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
