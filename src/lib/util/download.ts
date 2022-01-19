export default function downloadFile(
	data: string,
	options?: {
		filename?: string;
		type?: string;
	}
): void {
	if (!document) return;

	const aDownload = document.createElement('a');
	aDownload.download = options?.filename || 'file.txt';
	aDownload.href = URL.createObjectURL(
		new Blob([data], {
			type: options?.type ?? 'text/plain;charset=utf-8;',
		})
	);

	document.body.appendChild(aDownload);
	aDownload.click();
	document.body.removeChild(aDownload);

	URL.revokeObjectURL(aDownload.href);
}
