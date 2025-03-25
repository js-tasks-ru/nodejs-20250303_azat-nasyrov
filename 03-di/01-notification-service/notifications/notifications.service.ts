import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly logFilePath = path.join(
    __dirname,
    "../../logs/notifications.log",
  );
  private readonly senderEmail: string;
  private readonly smsGateway: string;

  constructor(private readonly configService: ConfigService) {
    this.senderEmail = this.configService.get<string>("SENDER_EMAIL");
    this.smsGateway = this.configService.get<string>("SMS_GATEWAY");
  }

  private logToFile(message: string): void {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(this.logFilePath, logMessage);
  }

  public async sendEmail(
    to: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const logMessage = `Email sent from ${this.senderEmail} to ${to}: [${subject}] ${message}`;
    this.logger.log(logMessage);
    this.logToFile(logMessage);
  }

  public async sendSMS(to: string, message: string): Promise<void> {
    const logMessage = `SMS sent via ${this.smsGateway} to ${to}: ${message}`;
    this.logger.log(logMessage);
    this.logToFile(logMessage);
  }
}
