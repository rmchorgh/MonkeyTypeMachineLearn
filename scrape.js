var monkeyTypeAll = () => {
	// call when the page detects a keypress
	document.addEventListener('keyup', async ({ key }) => {
		// guard against arrow keys etc.
		if (key.length > 1) return;

		// select language, layout and potentially funbox options
		var options = document
			.getElementById('testModesNotice')
			.querySelectorAll('[commands]');

		var layout = Array.from(options).filter(
			(e) => e.getAttribute('commands') == 'tags'
		)[0].innerText;

		var language = Array.from(options).filter(
			(e) => e.getAttribute('commands') == 'languages'
		)[0].innerText;

		var funbox = null;
		var funboxElements = Array.from(options).filter(
			(e) => e.getAttribute('commands') == 'funbox'
		);
		if (funboxElements.length > 0) {
			funbox = funboxElements[0].innerText;
		}

		// select the element containing the word currently being typed
		var activeElement = document.getElementsByClassName('word active')[0];

		// parse the word from the element
		var activeWord = Array.from(activeElement.children).reduce((acc, l) => {
			if (l.className.includes('incorrect')) {
				return acc + l.innerHTML[0];
			}
			return acc + l.innerText;
		}, '');

		// generate a timestamp
		var timestamp = new Date();

		// get the type of test being taken
		var type = document.querySelector('div.mode > [mode].active').innerText;

		// get the length of the current test
		var length = document.querySelector(
			'div.wordCount > [wordcount].active'
		).innerText;

		// build the request body
		var body = {
			activeWord,
			timestamp,
			lastChar: key,
			source: 'monkeytype',
			layout,
			type,
			length,
			language,
			funbox
		};

		// add the letter that should have been typed to the body
		var lie = activeElement.getElementsByClassName('incorrect');

		// if the correct letter was not typed
		if (lie.length > 0) {
			console.log('incorrect');
			lie = lie[lie.length - 1];
			body.correctChar = lie.innerHTML[0];
		}
		// if the correct letter was typed
		else {
			console.log('correct');
			body.correctChar = key;
		}

		// make the request
		await fetch('http://localhost:8000', {
			method: 'post',
			body: JSON.stringify(body)
		});
	});
};

monkeyTypeAll();
