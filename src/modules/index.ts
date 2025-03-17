import { notificationModules } from './notifications';
import { userModules } from './users';

export const modulesFederation: Function[] = [...userModules, ...notificationModules];
export const modulesFederationPubSubConsumers: Function[] = [];
export const modulesFederationRequestReplyConsumers: Function[] = [];
