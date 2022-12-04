var monkeyTypeAll = ({
	layout,
	testType,
	testLength,
	testLanguage,
	wildcards
}) => {
	document.addEventListener('keyup', async ({ key }) => {
		if (key.length > 1) return;

		var activeElement = document.getElementsByClassName('word active')[0];
		var activeWord = Array.from(activeElement.children).reduce((acc, l) => {
			if (l.className.includes('incorrect')) {
				return acc + l.innerHTML[0];
			}
			return acc + l.innerText;
		}, '');

		var timestamp = new Date();

		var lastIncorrect = activeElement.getElementsByClassName('incorrect');
		if (lastIncorrect.length > 0) {
			lastIncorrect = lastIncorrect[lastIncorrect.length - 1];
			console.log('incorrect');
			await fetch('http://localhost:8000', {
				method: 'post',
				body: JSON.stringify({
					timestamp,
					activeWord,
					lastChar: key,
					correctChar: lastIncorrect.innerHTML[0],
					source: 'monkeytype',
					layout,
					testType,
					testLength,
					testLanguage,
					wildcards
				})
			});
		} else {
			console.log('correct');
			await fetch('http://localhost:8000', {
				method: 'post',
				body: JSON.stringify({
					timestamp,
					activeWord,
					lastChar: key,
					correctChar: key,
					source: 'monkeytype',
					layout,
					testType,
					testLength,
					testLanguage,
					wildcards
				})
			});
		}
	});
};

// monkeyTypeAll({
// 	layout: 'qwerty',
// 	testType: 'words',
// 	testLength: 10,
// 	testLanguage: 'english',
// 	wildcards: null
// });

monkeyTypeAll({
	layout: 'semicolemak',
	testType: 'words',
	testLength: 10,
	testLanguage: 'english',
	wildcards: null
});
