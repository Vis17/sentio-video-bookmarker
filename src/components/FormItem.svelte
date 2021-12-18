<script lang="ts">
	import { OptionId } from '../lib/sentio/options/options';

	export let name: OptionId;
	export let checked: boolean = true;
</script>

<div class="form-item no-select">
	<label for={name}>
		<p>
			<slot name="title">Where is the title?</slot>
		</p>
		{#if $$slots.description}
			<small>
				<slot name="description" />
			</small>
		{/if}
	</label>
	<slot name="input">
		<input type="checkbox" {name} id={name} bind:checked />
	</slot>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.form-item {
		@include a.flex-container(row);

		margin: 1rem;
	}
</style>
