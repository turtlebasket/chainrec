<script lang="ts">
    export let text: string = "";
</script>

<div class="px-4 py-2 rounded-md hover:bg-zinc-200 cursor-pointer select-none flex flex-row items-center">
    <div class="w-4 h-4 mr-2">
        <slot/>
    </div>
    <div class="font-semibold text-md">{text}</div>
</div>
