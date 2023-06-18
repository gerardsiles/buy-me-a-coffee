'use client';
import Comments from './components/Comments';
import { AirtableRecord } from '@/types';
import getComments from '@/lib/getComments';
import Donate from './components/Donate';
import Link from 'next/link';
import { BiCopy } from 'react-icons/bi';

export default async function Home() {
	const data: Promise<AirtableRecord> = getComments();
	const comments = await data;

	return (
		<main className=''>
			<div className='flex-column items-center content-center text-center mt-2'>
				<h1 className='text-4xl font-bold'>Next.js + Stripe + Airtable</h1>
				<p className='text-m mt-2'>
					This is a demo of a Next.js app with Stripe and Airtable integration.
					The payment method is in test mode, you can use this card with any CVC
					and a future expiration date: 4242424242424242
				</p>

				<p>
					{' '}
					or use one from{' '}
					<Link
						className='text-blue-500 underline'
						href='https://stripe.com/docs/testing'
						target='_blank'
						rel='noopener noreferrer'
					>
						stripe test cards.
					</Link>
				</p>
			</div>
			<div className='flex flex-col md:flex-row max-w-2xl m-auto space-x-6 mt-5 mb-10'>
				<div className='flex-1'>
					<Comments comments={comments.records} />
				</div>
				<div className='flex-1'>
					<Donate />
				</div>
			</div>
		</main>
	);
}
