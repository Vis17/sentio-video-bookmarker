import 'svelte'; // avoid compiling errors
import '../scss/index.scss';
import App from './App.svelte';

const options = new App({
	target: document.body,
});

export default options;
