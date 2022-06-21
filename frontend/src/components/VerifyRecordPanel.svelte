<script lang="ts">
    import hashFileData from "$lib/hash";
    import type { EntryAnon } from "$lib/types";
    export let item: EntryAnon;
    export let xClickFunc = () => {}
    let fileInput;
    let fileSelected;
    let fileName: string = "";
    let dataHash: string = "";
    const onFileSelected =(e)=>{
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            fileSelected = e.target.result
            fileName = file.name
            dataHash = hashFileData(fileSelected)
        };
    }
</script>

<div class="bg-zinc-50 p-6 rounded-lg flex flex-col">
    <div class="flex flex-row items-center">
        <div class="text-xl">Verify Record</div>
        <div class="ml-auto w-4 cursor-pointer" on:click={xClickFunc}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
        </div>
    </div>
    <div class="flex font-semibold text-2xl mt-4 overflow-hidden">{item.entryInfo}</div>
    <div class="flex text-md text-zinc-600 mt-1 overflow-hidden">Created on {new Date(item.timestamp * 1000).toLocaleDateString()}</div>
    <div class="flex text-md text-zinc-600 mt-1 overflow-hidden">Created by {item.ownerAddress}</div>

    <div class="flex text-lg mt-4 overflow-hidden">Orig. hash: {item.entry}</div>
    <div class="cursor-pointer mt-4 bg-zinc-100 hover:bg-zinc-200 rounded-md p-2 border-2" on:click={()=>{fileInput.click()}}>
        {#if fileName != ""}{fileName}
        {:else}Choose File
        {/if}
    </div>
    <input style="display:none" type="file" on:change={(e)=>onFileSelected(e)} bind:this={fileInput} >

    {#if dataHash != ""}
        <div class="flex mt-4 overflow-hidden">New hash: {dataHash}</div>
        <div class="flex flex-row mt-4 rounded-md p-4 {dataHash == item.entry ? "bg-green-300" : "bg-red-300"} items-center">
            <div class="w-8 mr-4 ml-auto">
            {#if dataHash == item.entry}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/></svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
            {/if}
            </div>
            <div class="text-xl mr-auto">{dataHash == item.entry ? "Hashes match" : "No match"}</div>
        </div>
    {/if}
</div>
