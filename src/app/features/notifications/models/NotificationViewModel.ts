import { NotificationValueModel } from './NotificationValueModel';

export class NotificationViewModel {
    id: string;
    notificationType: string;
    status: string;
    createdDate: string;
    value: NotificationValueModel;
    totalCount: number;
}
