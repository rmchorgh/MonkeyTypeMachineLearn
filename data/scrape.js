var monkeyQueue = [];
var monkeyList = [];
var monkeyListen = () => {
	let layout, language, funbox, type, length, activeWord;
	let testNum = 0;

	let setup = () => {
		let words = document.querySelector('#words');
		monkeyQueue = Array.from(words.children).map((v, i, a) => {
			return i < a.length - 1 ? `${v.innerText} ` : v.innerText;
		}, '');

		let options = Array.from(
			document
				.querySelector('#testModesNotice')
				.querySelectorAll('[commands]')
		);

		layout = options.filter((e) => e.getAttribute('commands') == 'tags')[0]
			.innerText;
		language = options.filter(
			(e) => e.getAttribute('commands') == 'languages'
		)[0].innerText;
		let funboxElements = options.filter(
			(e) => e.getAttribute('commands') == 'funbox'
		);

		funbox = null;
		if (funboxElements.length > 0) {
			funbox = funboxElements[0].innerText;
		}

		// get the type of test being taken
		type = document.querySelector('div.mode > [mode].active').innerText;

		// get the length of the current test
		length = document.querySelector(
			'div.wordCount > [wordcount].active'
		).innerText;

		activeWord = monkeyQueue[0];
		testNum += 1;
		console.log(monkeyQueue);
	};

	const send = async () => {
		console.log('Sending test', testNum);
		await fetch('http://localhost:8000', {
			method: 'post',
			body: JSON.stringify(monkeyList)
		})
			.then(() => {
				monkeyList = [];
				setTimeout(setup, 500);
			})
			.catch(() => {
				monkeyList = [];
				setTimeout(setup, 500);
			});
	};

	setup();
	let listen = async ({ key }) => {
		try {
			let row = {
				activeWord,
				correctChar: monkeyQueue[0][0],
				funbox,
				language,
				lastChar: key,
				layout,
				length,
				timestamp: new Date(),
				type,
				testNum
			};

			if (key.length == 1) monkeyList.push(row);

			console.log(monkeyQueue[0][0], key);
			if (
				monkeyQueue[0][0].toLowerCase() == key.toLowerCase() ||
				(monkeyQueue[0][0] == '_' && key == '-')
			) {
				monkeyQueue[0] = monkeyQueue[0].substring(1);
			}

			if (key == ' ' && activeWord != monkeyQueue[0]) {
				monkeyQueue.shift();
				console.log(monkeyQueue);
				activeWord = monkeyQueue[0];
			}

			if (key == 'Enter') {
				console.log('Not empty reset');
				await send();
			}
		} catch {
			if (key == 'Enter') {
				console.log('Empty reset');
				await send();
			}
		}
	};

	document.addEventListener('keypress', async (c) => await listen(c));
};

monkeyListen();
