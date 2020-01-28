import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

function Spinner({ message }) {
	return (
		<div className='spinner'>
			<CircularProgress color='secondary' />
			<div>{message}</div>
		</div>
	);
}
export default Spinner;
