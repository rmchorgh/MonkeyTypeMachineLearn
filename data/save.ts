// import the webserver in the deno way
import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';

type Input = {
	timestamp: Date;
	activeWord: string;
	lastChar: string;
	correctChar: string;
	layout: string;
	type: string;
	length: string;
	language: string;
	testNum: number;
	funbox: string;
};

const handler = async (req: Request) => {
	return await req
		.json()
		.then(async (test: Input[]) => {
			for (let {
				timestamp,
				activeWord,
				lastChar,
				correctChar,
				layout,
				type,
				length,
				language,
				funbox,
				testNum
			} of test) {
				// handle potential commas in strings
				const hasComma = (word: string) =>
					word.includes(',')
						? `"${word}"`
						: word.includes('"')
						? word.replace('"', '\\"')
						: word;

				// build the csv row
				let row = `${timestamp},${hasComma(activeWord)},${hasComma(
					lastChar
				)},${hasComma(
					correctChar
				)},${layout},${testNum},${type},${length},${language},${funbox}\n`;

				// update data file
				await Deno.writeTextFile('data.csv', row, {
					append: true
				});
			}

			console.log('Recorded test', test[0].testNum);
		})
		.then(() => {
			return new Response(JSON.stringify({ hi: 'hi' }), {
				status: 200,
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST',
					'Access-Control-Allow-Origin': '*'
				}
			});
		});
};

// start localserver
serve(handler);

// deno run --allow-net --allow-write save.ts
