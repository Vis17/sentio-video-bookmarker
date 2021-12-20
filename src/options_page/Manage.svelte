<script lang="ts">
	//#region imports
	import Sentio from '../lib/sentio/sentio';
	//#endregion

	let sentio: Sentio | undefined;
	browser.runtime.getBackgroundPage().then(w => {
		sentio = w?.sentio;
	});
</script>

<div>
	<!-- content here -->
</div>

<style lang="scss">
</style>
