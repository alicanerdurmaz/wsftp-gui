export const dateNow = () => {
	let temp = new Date().toString();
	let dateArray = temp.split(' ');
	let DateNow = dateArray[1] + ' ' + dateArray[2] + ', ' + dateArray[3] + ' - ' + dateArray[4];
	return DateNow;
};
