import {Signale} from 'signale';

export const logger = new Signale({
	config: {
		displayTimestamp: true,
		displayLabel: false,
		displayBadge: true,
		displayScope: true,
		displayDate: true,
	},
});
