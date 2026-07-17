import logger from '../utils/logger';

export class TwilioService {
  async sendWhatsApp(to: string, message: string): Promise<boolean> {
    try {
      // Mock implementation for development
      // In production, use: const twilio = require('twilio');
      logger.info(`WhatsApp sent to ${to}: ${message}`);
      return true;
    } catch (error) {
      logger.error(`Error sending WhatsApp to ${to}: ${error}`);
      return false;
    }
  }
}

export const twilioService = new TwilioService();
