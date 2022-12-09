// import the webserver in the deno way
import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';

const handler = async (req: Request): Promise<Response> => {
	// extract the json body from the request sent from the browser
	await req.json().then(
		// destructure the contents of the json
		async ({
			timestamp,
			activeWord,
			lastChar,
			correctChar,
			source,
			layout,
			type,
			length,
			language,
			funbox
		}) => {
			// handle potential commas in strings
			const hasComma = (word: string) =>
				word.includes(',') ? `"${word}"` : word;

			// build the csv row
			let row = `${timestamp},${hasComma(activeWord)},${hasComma(
				lastChar
			)},${correctChar},${source},${layout},${type},${length},${language},${funbox}\n`;

			// update data file
			await Deno.writeTextFile('data.csv', row, {
				append: true
			});
		}
	);

	// respond to browser
	return new Response(JSON.stringify({ hi: 'hi' }), {
		status: 200,
		headers: {
			'Access-Control-Allow-Methods': 'GET, POST',
			'Access-Control-Allow-Origin': '*'
		}
	});
};

console.log('Listening on http://localhost:8000');

// start localserver
serve(handler);
