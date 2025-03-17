import { WelcomeUserEmailNotificationIntegrationEvent } from '@/modules/notifications/apps/features/v1/welcomeUserEmail/events/integrations/welcomeEmail';
import medaitR from '@/shared/medaitR';
import { sealed } from '@/shared/utils/decorators/sealed';
import { logger } from '@/shared/utils/helpers/loggers';
import { NotificationData, notificationHandler, NotificationHandler } from 'mediatr-ts';

// Region Domain Event
export class UserCreatedDomainEvent extends NotificationData {
	private readonly _emailId: string;
	private readonly _fullName: string;

	public constructor(emailId: string, fullName: string) {
		super();
		this._emailId = emailId;
		this._fullName = fullName;
	}

	public get emailId(): string {
		return this.emailId;
	}

	public get fullName(): string {
		return this._fullName;
	}
}
// #endregion

// Region Domain Event Handler
@sealed
@notificationHandler(UserCreatedDomainEvent)
export class UserCreatedDomainEventHandler implements NotificationHandler<UserCreatedDomainEvent> {
	public async handle(notification: UserCreatedDomainEvent): Promise<void> {
		try {
			if (!notification) throw new Error(`Notification is required`);

			if (!notification.fullName) throw new Error('FullName is required');

			if (!notification.emailId) throw new Error(`EmailId is required`);

			// Call Welcome email Event
			await medaitR.publish(
				new WelcomeUserEmailNotificationIntegrationEvent(
					notification.emailId,
					notification.fullName
				)
			);
		} catch (ex) {
			logger.error(`Error in domain event: ${ex.message}`);
		}
	}
}
// endregion
