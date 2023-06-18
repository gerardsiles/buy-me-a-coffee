import { AIRTABLE_API_KEY, AIRTABLE_APP_ID } from '@/config';
import { AirtableRecord } from '@/types';

export default async function getComments() {
	const url = `https://api.airtable.com/v0/${AIRTABLE_APP_ID}/donations?maxRecords=3&view=Grid%20view`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			Authorization: `Bearer ${AIRTABLE_API_KEY}`,
		},
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error('Failed to fetch API');
	}

	const data = (await response.json()) as AirtableRecord;
	return data;
}
