export const searchFunction = async ([...data], searchTerm, setLoading) => {
	console.log(data.length);
	let offset = 0;
	const foundedList = [];
	data.reverse().forEach((e, i) => {
		offset++;
		if (e.contentType === 'text')
			if (e.content.includes(searchTerm)) {
				foundedList.push([]);
				foundedList[foundedList.length - 1].push(data[i - 1]);
				foundedList[foundedList.length - 1].push(e);
				foundedList[foundedList.length - 1].push(data[i + 1]);
				foundedList[foundedList.length - 1][1].offset = offset;
			}
	});

	setLoading(false);
	return foundedList;
};
