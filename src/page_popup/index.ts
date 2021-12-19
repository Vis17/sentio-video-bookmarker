import 'svelte'; // avoid compiling errors
import '../scss/index.scss';
import Popup from './Popup.svelte';

const popup = new Popup({
	target: document.body,
});

export default popup;
