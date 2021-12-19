import 'svelte'; // avoid compiling errors
import '../scss/index.scss';
import Options from './Options.svelte';

const options = new Options({
	target: document.body,
});

export default options;
