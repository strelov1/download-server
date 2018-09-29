const fs = require('fs');

const download = require('../src/download');

const downloadFile = `${__dirname}/downloadFile.tmp`;
const downloadMockFile = `${__dirname}/download.mock.file.txt`;
const existMockFile = `${__dirname}/mock.file.txt`;

describe('Client headers', () => {
	const fleStream = fs.createWriteStream(downloadFile);
	fleStream.headers = {};
	fleStream.setHeaders = (headers) => {
		fleStream.headers = headers;
	};
	download('http://nodejs.org/dist/index.json', {}, fleStream).then(() => {
		// Server Headers
		expect(fleStream.headers.server).toBe('cloudflare');
		// Downlaod client Headers
		expect(fleStream.headers['Content-disposition']).toBe(`attachment; filename='index.json'`);
		fs.unlinkSync(downloadFile);
	});
});

test('Client download', async () => {
	const fleStreamDownlaod = fs.createWriteStream(downloadMockFile);
	fleStreamDownlaod.headers = {};
	fleStreamDownlaod.setHeaders = (headers) => {
		fleStreamDownlaod.headers = headers;
	};

	download(
		'https://raw.githubusercontent.com/strelov1/download-server/master/__test__/mock.file.txt',
		{},
		fleStreamDownlaod
	).then(() => {
		fs.readFile(existMockFile, 'utf8', (errMockFile, contentsMockFile) => {
			fs.readFile(downloadMockFile, 'utf8', (errDownloadFile, contentsDownloadFile) => {
				expect(contentsMockFile).toEqual(contentsDownloadFile);
				fs.unlinkSync(downloadMockFile);
			});
		});
	});
});
