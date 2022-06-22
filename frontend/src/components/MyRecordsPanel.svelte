<script lang="ts">
import type { Entry, EntryAnon } from "$lib/types";
import { verifyXClickDestination } from "$lib/uistore";
import { queryFullUserRecords, queryUserRecords } from "$lib/wallet";
export let onCreateFunc=() => {};
export let clickItemFunc=() => {};
export let selectedItem: Entry;
</script>

<!-- {#await queryUserRecords()}  -->
{#await queryFullUserRecords()} 
	<div class="flex flex-col mt-6 text-lg items-center">
		<div>Loading...</div><br>
		<div>Note that a query permit must be signed to view personal data contained in records.</div>
	</div>
{:then items }
    <div class="rounded-2xl bg-zinc-50 p-4 flex flex-col overflow-y-scroll no-scrollbar">
		{#if items.length > 0 || !items}
            <div class="flex ml-auto px-4 py-2 text-zinc-50 bg-zinc-900 hover:bg-zinc-700 rounded-md cursor-pointer select-none mb-4"
            on:click={onCreateFunc}>
                <div class="text-lg font-semibold">Create New</div>
            </div>
            {#each items.reverse() as item}
				<div class="flex flex-row py-2 px-4 rounded-xl hover:bg-zinc-100 cursor-pointer" on:click={() => {
					selectedItem = item; 
					$verifyXClickDestination = "my-records"
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
			<div class="flex flex-row py-2 px-4 rounded-xl items-center">
				<div class="flex text-lg">No records to list.</div>
                <div class="flex ml-auto px-4 py-2 text-zinc-50 bg-zinc-900 hover:bg-zinc-700 rounded-md cursor-pointer select-none"
                on:click={onCreateFunc}>
                    <div class="text-lg font-semibold">Create New</div>
                </div>
			</div>
		{/if}
    </div>
{/await}
