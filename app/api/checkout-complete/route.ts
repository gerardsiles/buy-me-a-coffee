import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import {
	AIRTABLE_API_KEY,
	AIRTABLE_APP_ID,
	DONATION_IN_CENTS,
	STRIPE_API_KEY,
	STRIPE_WEBHOOK_SECRET,
} from '@/config';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

async function insertToAirTable({
	name,
	message,
	amount,
}: {
	name: string;
	message: string;
	amount: number;
}) {
	const url = `https://api.airtable.com/v0/${AIRTABLE_APP_ID}/donations`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${AIRTABLE_API_KEY}`,
		},
		body: JSON.stringify({
			records: [
				{
					fields: {
						name,
						message,
						amount,
					},
				},
			],
		}),
	});

	return response.json();
}

const stripe = new Stripe(STRIPE_API_KEY, {
	apiVersion: '2022-11-15',
});

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(req: NextRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return new NextResponse(JSON.stringify({ message: 'Method not allowed' }), {
			status: 405,
			statusText: 'Method not allowed',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
	const headersInstance = headers();
	const signature = headersInstance.get('stripe-signature') as string;

	if (!signature) {
		return new NextResponse(JSON.stringify({ message: 'No signature' }), {
			status: 400,
			statusText: 'Bad Request',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	let event: Stripe.Event;
	const buf = await req.text();
	try {
		event = stripe.webhooks.constructEvent(
			buf,
			signature,
			STRIPE_WEBHOOK_SECRET
		);
	} catch (error: any) {
		console.error('invalid signature', error.message);
		return new NextResponse(JSON.stringify({ message: 'Invalid signature' }), {
			status: 400,
			statusText: 'Bad Request',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	if (event.type !== 'checkout.session.completed') {
		return new NextResponse(JSON.stringify({ message: 'Invalid signature' }), {
			status: 400,
			statusText: 'Bad Request',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	const metadata = (
		event.data.object as { metadata: { name: string; message: string } }
	).metadata;

	const amount =
		(event.data.object as { amount_total: number }).amount_total / 100;

	await insertToAirTable({
		...metadata,
		amount,
	}).catch(error => {
		console.log('Error creating record in Airtable');
		console.error('error', error);
	});

	return new NextResponse(JSON.stringify({ message: 'OK' }), {
		status: 200,
		statusText: 'OK',
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
