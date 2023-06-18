import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import {
	AIRTABLE_API_KEY,
	AIRTABLE_APP_ID,
	STRIPE_API_KEY,
	STRIPE_WEBHOOK_SECRET,
} from '@/config';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { AirtableRecord } from '@/types';

async function getDonations() {
	const url = `https://api.airtable.com/v0/${AIRTABLE_APP_ID}/donations?maxRecords=3&view=Grid%20view`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${AIRTABLE_API_KEY}`,
		},
	});
	if (!response.ok) {
		throw new Error('Failed to fetch API');
	}

	const data = (await response.json()) as AirtableRecord;
	return data;
}

export async function GET(req: NextRequest, res: NextApiResponse) {
	console.log('is fetching');
	if (req.method !== 'GET') {
		return new NextResponse(JSON.stringify({ message: 'Method not allowed' }), {
			status: 405,
			statusText: 'Method not allowed',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	const donations = await getDonations();

	if (donations)
		return new NextResponse(JSON.stringify(donations), {
			status: 200,
			statusText: 'OK',
			headers: {
				'Content-Type': 'application/json',
			},
		});

	return new NextResponse(JSON.stringify({ message: 'OK' }), {
		status: 200,
		statusText: 'OK',
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
