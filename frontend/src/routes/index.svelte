<script>
import { goto } from "$app/navigation";
</script>

<head>
    <title>ChainRec</title>
</head>

<div class="mt-16 w-screen flex flex-col items-center px-10">
    <div class="w-60">
        <img src="/chainrec-transparent.svg" alt="ChainRec">
    </div>
    <div class="h-12"/>
    <div class="font-bold text-6xl text-center">Universal Proof of Existence.</div>
    <div class="h-12"/>
    <div class="text-lg">ChainRec lets you uniquely ID data on-chain, documenting that it existed at a certain point in time.</div>
    <div class="h-12"/>
    <div class="flex flex-row">
        <div on:click={() => goto("/about")} class="cursor-pointer rounded-xl mx-4 py-3 px-6 text-lg font-semibold bg-zinc-100 hover:bg-zinc-200">Learn More</div>
        <div on:click={() => goto("/app")} class="cursor-pointer rounded-xl mx-4 py-3 px-6 text-lg font-semibold bg-zinc-900 hover:bg-zinc-700 text-zinc-100">Get Started</div>
    </div>
    <div class="h-12"/>
</div>
