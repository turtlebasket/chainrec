<head>
	<title>App | ChainRec</title>
</head>
<script lang="ts">
	import { ensureKeplr, keplrConnected, keplrInstalled, tryInitKeplr } from '../lib/wallet';
    import BrowsePanel from '../components/BrowsePanel.svelte';
    import MyRecordsPanel from '../components/MyRecordsPanel.svelte';
    import CreateRecordPanel from '../components/CreateRecordPanel.svelte';
    import VerifyRecordPanel from '../components/VerifyRecordPanel.svelte';
    import type { EntryAnon } from '$lib/types';
	let selected = 'browse'; // browse, my-records, create, verify
    let selectedItem: EntryAnon;
</script>

<div class="mt-8 w-screen flex flex-col items-center px-10">
	<div class="flex flex-row rounded-lg bg-zinc-50 select-none">
		<div class="flex cursor-pointer rounded-lg font-semibold {selected == 'browse'
				? 'bg-zinc-200' : 'bg-zinc-50 hover:bg-zinc-200'} py-2 px-4 my-2 ml-3"
			on:click={() => { selected = 'browse'; }}>Browse All</div>
		<div class="flex cursor-pointer rounded-lg font-semibold {
            selected == 'my-records' || selected == 'create' || selected == 'verify'
				? 'bg-zinc-200' : 'bg-zinc-50 hover:bg-zinc-200'} py-2 px-4 my-2 ml-3"
			on:click={() => { selected = 'my-records'; }}>My Records</div>
        <div class="w-3"/>
	</div>
    <div class="my-6 w-5/6 lg:w-2/3">
        {#await ensureKeplr()}
        <div class="flex flex-col items-center">
            <div class="text-lg mt-6">Enabling Keplr...</div>
        </div>
        {:then}
            {#if !$keplrConnected || !$keplrInstalled }
            <div class="text-lg mx-auto">
                <strong>NOTE:</strong> The
                <a href="https://keplr.app" class="underline" target="_blank">Keplr Wallet</a> 
                extension must be installed to use ChainRec.
            </div>
            {:else if selected == "browse"}
            <BrowsePanel/>
            {:else if selected == "my-records"}
            <MyRecordsPanel onCreateFunc={() => { selected = "create" }} clickItemFunc={() => selected = "verify"} bind:selectedItem={selectedItem}/>
            {:else if selected == "create"}
            <CreateRecordPanel xClickFunc={() => { selected = "my-records" }}/>
            {:else if selected == "verify"}
            <VerifyRecordPanel xClickFunc={() => {selected = "my-records"}}
                bind:item={selectedItem}
            />
            {:else}
            <div class="text-lg mt-16">Invalid Option</div>
            {/if}
        {:catch}
        <div class="">
            <div class="text-lg">There was an error enabling Keplr.</div>
        </div>
        {/await}
    </div>
</div>
