<script lang="ts">
	import { OptionId } from '../lib/sentio/options/options';

	export let name: OptionId | string;
	export let column = false;
	export let inputLeft = false;
</script>

<div class="form-item no-select">
	<label for={name} class:column class:input-left={inputLeft}>
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
		<div class="form-item-input">
			<slot name="input" />
		</div>
	</label>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.form-item {
		margin: 1rem;

		label {
			@include a.flex-container(row);
			align-items: center;
			gap: 1rem;

			&.input-left {
				align-items: flex-start;
				justify-content: left;
				flex-direction: row-reverse;
			}

			&.column {
				flex-flow: column nowrap;
				align-items: flex-start;

				.form-item-input {
					width: 100%;
				}
			}
		}
	}
</style>
