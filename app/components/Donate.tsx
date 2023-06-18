'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DONATION_IN_CENTS, MAX_DONATION_IN_CENTS } from '@/config';
import Image from 'next/image';

const Donate = () => {
	const router = useRouter();

	const [error, setError] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');

	const presets = [1, 3, 5];

	async function handleCheckout() {
		setError(null);
		const response = await fetch('/api/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				quantity,
				name,
				message,
			}),
		});

		const res = await response.json();
		if (res.url) {
			const url = res.url;
			router.push(url);
		}
		if (res.error) {
			setError(res.error);
		}
	}
	return (
		<div className=''>
			<h1>Buy me a coffee</h1>
			{error && (
				<div className=''>
					<p className='text-red-500'>{error}</p>
				</div>
			)}
			<div className='flex items-center full-w mb-2'>
				<span className='mr-2'>
					<Image src='/coffee.svg' alt='coffee' width={50} height={100} />
				</span>
				<span className='mr-2'>X</span>
				{presets.map(p => (
					<button
						className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
						key={`preset-${p}`}
						onClick={() => setQuantity(p)}
					>
						{p}
					</button>
				))}
				<input
					type='number'
					value={quantity}
					onChange={e => setQuantity(+e.target.value)}
					min={1}
					max={MAX_DONATION_IN_CENTS / DONATION_IN_CENTS}
					className='shadow rounded w-full border border-blue-500 p-2'
				/>
			</div>
			<div className='mb-2 rounded w-full'>
				<label className='block'>Name (Optional)</label>
				<input
					className='shadow rounded w-full border border-blue-500 p-2'
					placeholder='John Doe'
					type='text'
					value={name}
					onChange={e => setName(e.target.value)}
				/>
			</div>

			<div className=''>
				<label>Message (Optional)</label>
				<textarea
					className='shadow rounded w-full border border-blue-500 p-2'
					value={message}
					onChange={e => setMessage(e.target.value)}
					placeholder='Thank you for your hard work!'
				/>
			</div>

			<button
				className='bg-blue-500 rounded shadow px-4 py-2 text-white mt-2'
				onClick={handleCheckout}
			>
				Donate ${quantity * (DONATION_IN_CENTS / 100)}
			</button>
		</div>
	);
};
export default Donate;
