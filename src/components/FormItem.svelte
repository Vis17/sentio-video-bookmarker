<script lang="ts">
	import { OptionId } from '../lib/sentio/options/options';

	export let name: OptionId | string;
	export let checked: boolean = true;
</script>

<div class="form-item no-select">
	<label for={name}>
		<div>
			<p>
				<slot name="title">Where is the title?</slot>
			</p>
			{#if $$slots.description}
				<small>
					<slot name="description" />
				</small>
			{/if}
		</div>
		<slot name="input">
			<input type="checkbox" {name} id={name} bind:checked />
		</slot>
	</label>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.form-item {
		margin: 1rem;

		label {
			@include a.flex-container(row);
			align-items: center;
		}
	}
</style>
