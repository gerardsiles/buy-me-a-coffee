import getComments from '@/lib/getComments';
import { Record } from '@/types';

const Comments = ({ comments }: { comments: Record[] }) => {
	return (
		<div className=''>
			<h2>Previous Donations</h2>
			<ul>
				{comments.map((comment: Record) => (
					<li key={comment.id} className='p-4 shadow mb-2'>
						<p>
							{comment.fields.name} donated {comment.fields.amount}$
						</p>
						<p>message: {comment.fields.message}</p>
					</li>
				))}
			</ul>
		</div>
	);
};
export default Comments;
