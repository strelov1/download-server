const fs = require('fs');

const download = require('../src/download');

const downloadFile = `${__dirname}/downloadFile.tmp`;
const downloadMockFile = `${__dirname}/download.mock.file.txt`;
const existMockFile = `${__dirname}/mock.file.txt`;

const reponseStreamMock = (filename) => {
	const fleStream = fs.createWriteStream(filename);
	fleStream.headers = {};
	fleStream.setHeaders = (headers) => {
		fleStream.headers = headers;
	};
	fleStream.error = (e) => e;
	return fleStream;
};

describe('Client headers', () => {
	const responseStream = reponseStreamMock(downloadFile);
	download('http://nodejs.org/dist/index.json', {}, responseStream)
		.then(() => {
			// Server Headers
			expect(responseStream.headers.server).toBe('cloudflare');
			// Downlaod client Headers
			expect(responseStream.headers['Content-disposition']).toBe(`attachment; filename='index.json'`);
			fs.unlinkSync(downloadFile);
		})
		.catch((e) => {
			expect(e).toBe(undefined);
			fs.unlinkSync(downloadFile);
		});
});

test('Client download', async () => {
	const responseStream = reponseStreamMock(downloadFile);

	download(
		'https://raw.githubusercontent.com/strelov1/download-server/master/__test__/mock.file.txt',
		{},
		responseStream
	)
		.then(() => {
			fs.readFile(existMockFile, 'utf8', (errMockFile, contentsMockFile) => {
				fs.readFile(downloadMockFile, 'utf8', (errDownloadFile, contentsDownloadFile) => {
					expect(contentsMockFile).toEqual(contentsDownloadFile);
					fs.unlinkSync(downloadMockFile);
				});
			});
		})
		.catch((e) => {
			expect(e).toBe(undefined);
			fs.unlinkSync(downloadMockFile);
		});
});
