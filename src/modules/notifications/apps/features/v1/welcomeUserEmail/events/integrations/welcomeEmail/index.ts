import { sealed } from '@/shared/utils/decorators/sealed';
import { logger } from '@/shared/utils/helpers/loggers';
import { NotificationData, notificationHandler, NotificationHandler } from 'mediatr-ts';

export class WelcomeUserEmailNotificationIntegrationEvent extends NotificationData {
	private readonly _emailId: string;
	private readonly _fullName: string;

	public constructor(emailId: string, fullName: string) {
		super();
		this._emailId = emailId;
		this._fullName = fullName;
	}

	public get emailId(): string {
		return this._emailId;
	}

	public get fullName(): string {
		return this._fullName;
	}
}

@sealed
@notificationHandler(WelcomeUserEmailNotificationIntegrationEvent)
export class WelcomeUserEmailNotificationIntegrationEventHandler
	implements NotificationHandler<WelcomeUserEmailNotificationIntegrationEvent>
{
	public handle(notification: WelcomeUserEmailNotificationIntegrationEvent): Promise<void> {
		try {
			const emailBody = `
        Dear ${notification.fullName}
        *****
      `;
			console.log(`email send Successfully to ${notification.emailId}`);

			return Promise.resolve();
		} catch (ex) {
			logger.error(`Error in sending email: ${ex.message}`);
		}
	}
}
