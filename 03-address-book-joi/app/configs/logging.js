import Signale from 'signale/signale.js';

/**
 * Logger to better track info
 */
export const logger = new Signale({
	config: {
		displayTimestamp: true,
		displayLabel: false,
		displayBadge: true,
		displayScope: true,
		displayDate: true,
	},
});
