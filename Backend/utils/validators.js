module.exports.validateRegisterInput = (username, password, confirmPassword, email) => {
	const errors = {};
	if (username.trim() === '') {
		errors.username = 'Username must not be empty !';
	}
	if (email.trim() === '') {
		errors.email = 'Email must not be empty !';
	}
	else {
		const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (!email.match(regEx)) {
			errors.email = 'Email must be a valid email address !';
		}
	}
	if (password === '') {
		errors.password = 'Password must not be empty !';
	}
	else if (password.length < 6) {
		errors.password = 'Password must be at least 6 characters !';
	}
	else if (password !== confirmPassword) {
		errors.confirmPassword = 'Passwords must match !';
	}

	return {
		errors,
		valid  : Object.keys(errors).length < 1
	};
};

module.exports.validateLoginInput = (username, password) => {
	const errors = {};
	if (username.trim() === '') {
		errors.username = 'Username must not be empty !';
	}
	if (password === '') {
		errors.password = 'password must not be empty !';
	}

	return {
		errors,
		valid  : Object.keys(errors).length < 1
	};
};
