import Sentio from './lib/sentio/sentio';

declare global {
	interface Window {
		sentio?: Sentio;
	}
}
