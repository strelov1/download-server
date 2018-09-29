const fs = require('fs');

const download = require('../src/download');

const downloadFile = `${__dirname}/downloadFile.tmp`;
const mockFile = `${__dirname}/../README.md`;

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
	const fleStreamDownlaod = fs.createWriteStream(downloadFile);
	fleStreamDownlaod.headers = {};
	fleStreamDownlaod.setHeaders = (headers) => {
		fleStreamDownlaod.headers = headers;
	};

	download(
		'https://raw.githubusercontent.com/strelov1/download-server/master/README.md',
		{},
		fleStreamDownlaod
	).then(() => {
		fs.readFile(mockFile, 'utf8', (errMockFile, contentsMockFile) => {
			fs.readFile(downloadFile, 'utf8', (errDownloadFile, contentsDownloadFile) => {
				expect(contentsMockFile).toEqual(contentsDownloadFile);
				fs.unlinkSync(contentsMockFile);
				fs.unlinkSync(contentsDownloadFile);
			});
		});
	});
});
