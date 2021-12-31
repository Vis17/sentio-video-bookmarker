<script lang="ts">
	import { OptionId } from '../lib/sentio/options/options';

	export let name: OptionId | string;
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
		<slot name="input" />
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
