import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

function Spinner() {
	return (
		<div className='spinner'>
			<CircularProgress color='secondary' />
			<div>Searching...</div>
		</div>
	);
}
export default Spinner;
