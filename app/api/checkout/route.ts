import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { DONATION_IN_CENTS, STRIPE_API_KEY } from '@/config';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const stripe = new Stripe(STRIPE_API_KEY, {
	apiVersion: '2022-11-15',
});

export async function POST(req: NextRequest, res: NextApiResponse) {
	const body = await req.json();

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
	const quantity = body.quantity || 1;
	const name = body.name || 'Anonymous';
	const message = body.message || '';
	try {
		const session = await stripe.checkout.sessions.create({
			metadata: {
				name,
				message,
			},
			mode: 'payment',
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: 'Donation',
						},
						unit_amount: DONATION_IN_CENTS,
					},
					quantity,
				},
			],
			success_url: `${headersInstance.get('origin')}/`,
			cancel_url: `${headersInstance.get('origin')}/`,
		});

		const url = session.url;
		if (url) {
			return new NextResponse(JSON.stringify({ url }), {
				status: 200,
				statusText: 'OK',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		return new NextResponse(
			JSON.stringify({ message: 'Something went wrong' }),
			{
				status: 500,
				statusText: 'Something went wrong',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error: any) {
		console.log('Error creating session', error);
		return new NextResponse(
			JSON.stringify({ message: 'Something went wrong' }),
			{
				status: 500,
				statusText: 'Something went wrong',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}
