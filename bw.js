module.exports.getNewNumber = (req, res, next) => {
	// Order number from bandwidth
	const numbers = await bwApi.AvailableNumber.search('local', {
		areaCode : 910,
		quantity : 1
	});

	const newNumber = await bwApi.PhoneNumber.create({
		number : numbers[0].number;
		name: `${req.hostname}-click-to-call`
	});
	next()



	.then((numbers) => {
		debug(numbers);
		// Make number name the two numbers binded
		const numberName = req.body.numbers;
		newNumber = numbers[0].number;
		debug('Found New Number: ' + newNumber + ' for: ' + numberName);
		// Need number id to update
		const numberId = numbers[0].id;
		// Assign number to application
		debug('Updating Number to application: ' + app.applicationId);
		return bwApi.PhoneNumber.update(numberId, {
			name: numberName.toString(),
			applicationId: app.applicationId
		});
	})
	.then( () => {
		debug('Assigned number: ' + newNumber + ' to application');
		req.newNumber = newNumber;
		next();
	})
	.catch( (reason) => {
		debug(reason);
		next(reason);
	});
};