<script lang="ts">
	import { asFullEntry, type Entry } from '$lib/types';
import { verifyXClickDestination } from '$lib/uistore';
	import { queryAllRecords, queryLastRecordsRange } from '../lib/wallet';
	export let clickItemFunc=() => {};
	export let selectedItem: Entry;
</script>

<!-- {#await queryLastRecordsRange(20)} -->
{#await queryAllRecords()}
	<div class="flex flex-col mt-6 text-lg items-center"><div>Loading...</div></div>
{:then items}
	<div class="rounded-2xl bg-zinc-50 p-4 flex flex-col overflow-y-scroll no-scrollbar">
		{#if items.length != 0 || !items}
			{#each items.reverse() as item}
				<div class="flex flex-row py-2 px-4 rounded-xl hover:bg-zinc-100 cursor-pointer" on:click={() => {
					selectedItem = asFullEntry(item)
					$verifyXClickDestination = "browse"
					clickItemFunc()
				}}>
					<div class="flex flex-col">
						<div class="text-lg font-semibold">{item.entryInfo}</div>
						<div class="mt-1">Hash: {item.entry}</div>
						<div class="mt-1 text-zinc-500">Created by {item.ownerAddress}</div>
					</div>
					<div class="ml-auto text-md">{new Date(item.timestamp * 1000).toLocaleDateString()}</div>
				</div>
			{/each}
		{:else}
			<div class="flex py-2 px-4 rounded-xl items-center">
				<div class="flex text-lg">No records to list.</div>
			</div>
		{/if}
	</div>
{/await}
