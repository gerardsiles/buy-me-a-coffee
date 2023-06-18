export const DONATION_IN_CENTS = parseInt(
	process.env.NEXT_PUBLIC_DONATION_IN_CENTS || '500',
	10
);

export const MAX_DONATION_IN_CENTS = parseInt(
	process.env.NEXT_PUBLIC_MAX_DONATION_IN_CENTS || '10000',
	10
);

export const STRIPE_API_KEY = process.env.NEXT_PUBLIC_STRIPE_API_KEY as string;

export const STRIPE_WEBHOOK_SECRET = process.env
	.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET as string;

export const AIRTABLE_APP_ID = process.env
	.NEXT_PUBLIC_AIRTABLE_APP_ID as string;

export const AIRTABLE_API_KEY = process.env
	.NEXT_PUBLIC_AIRTABLE_API_KEY as string;
