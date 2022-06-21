<script lang="ts">
    import { createCopyrightRecord } from "$lib/wallet";
    import hashFileData from "../lib/hash";
    export let xClickFunc = () => {}
    let authorInfo: string = "";
    let entryInfo: string = "";
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
        <div class="text-xl">New Record</div>
        <div class="ml-auto w-4 cursor-pointer" on:click={xClickFunc}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
        </div>
    </div>
    <input class="mt-4 p-1 text-2xl rounded-md border-2 font-semibold" placeholder="Copyright Title" bind:value={entryInfo}>
    <input class="mt-4 p-1 text-lg rounded-md border-2" placeholder="Author Information" bind:value={authorInfo}>

    <div class="cursor-pointer mt-4 bg-zinc-100 hover:bg-zinc-200 rounded-md p-2 border-2" on:click={()=>{fileInput.click()}}>
        {#if fileName != ""}{fileName}
        {:else}Choose File
        {/if}
    </div>
    <input style="display:none" type="file" on:change={(e)=>onFileSelected(e)} bind:this={fileInput} >

    {#if dataHash != ""}
        <div class="ml-2 mt-1 overflow-ellipsis">Data Hash: {dataHash}</div>
    {/if}

    <div class="flex flex-row items-center mt-4" on:click={async () => {
        const res = await createCopyrightRecord(dataHash, entryInfo, authorInfo)
        console.log(res)
        xClickFunc()
    }}>
        <div class="ml-auto text-lg font-semibold py-2 px-4 rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-700 cursor-pointer">Publish Record</div>
    </div>
</div>