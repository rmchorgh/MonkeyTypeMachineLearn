var monkeyTypeAll = () => {
	document.addEventListener('keyup', async ({ key }) => {
		if (key.length > 1) return;
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

		var activeElement = document.getElementsByClassName('word active')[0];
		var activeWord = Array.from(activeElement.children).reduce((acc, l) => {
			if (l.className.includes('incorrect')) {
				return acc + l.innerHTML[0];
			}
			return acc + l.innerText;
		}, '');

		var timestamp = new Date();

		var body = {
			timestamp,
			activeWord,
			lastChar: key,
			source: 'monkeytype',
			layout,
			type: document.querySelector('div.mode > [mode].active').innerText,
			length: document.querySelector('div.wordCount > [wordcount].active')
				.innerText,
			language,
			funbox
		};

		// last incorrect element
		var lie = activeElement.getElementsByClassName('incorrect');
		if (lie.length > 0) {
			console.log('incorrect');
			lie = lie[lie.length - 1];
			body.correctChar = lie.innerHTML[0];
		} else {
			console.log('correct');
			body.correctChar = key;
		}

		console.log(body);

		await fetch('http://localhost:8000', {
			method: 'post',
			body: JSON.stringify(body)
		});
	});
};

monkeyTypeAll();
