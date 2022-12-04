import { serve } from 'https://deno.land/std@0.157.0/http/server.ts';

const handler = async (req: Request): Promise<Response> => {
	await req
		.json()
		.then(
			async ({
				timestamp,
				activeWord,
				lastChar,
				correctChar,
				source,
				layout,
				testType,
				testLength,
				testLanguage,
				wildcards
			}) => {
				let row = `${timestamp},`;

				row += activeWord.includes(',')
					? `"${activeWord}",`
					: `${activeWord},`;
				row += lastChar.includes(',')
					? `"${lastChar}",`
					: `${lastChar},`;
				row += correctChar.includes(',')
					? `"${correctChar}",`
					: `${correctChar},`;

				row += `${source},${layout},${testType},${testLength},${testLanguage},${wildcards}\n`;
				await Deno.writeTextFile('data.csv', row, {
					append: true
				});
			}
		);

	return new Response(JSON.stringify({ hi: 'hi' }), {
		status: 200,
		headers: {
			'Access-Control-Allow-Methods': 'GET, POST',
			'Access-Control-Allow-Origin': '*'
		}
	});
};

console.log('Listening on http://localhost:8000');
serve(handler);
