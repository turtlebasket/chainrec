<script>
	import { goto } from '$app/navigation';
	import NavButton from '../components/NavButton.svelte';

	let selected = 'home';
</script>

<!-- Only render on laptop/desktop aspect ratios -->
<div class="bg-zinc-50 flex flex-row items-center h-14">
	<!-- Left-aligned title -->
	<div
		class="flex flex-row items-center ml-3 cursor-pointer select-none"
		on:click={() => goto('/')}
	>
		<div class="w-8">
			<img src="/chainrec-transparent.svg" alt="ChainRec"/>
		</div>
		<div class="text-xl font-bold ml-2">ChainRec</div>
	</div>
	<div class="mr-2 ml-auto" on:click={() => goto('/app')}>
		<NavButton text="Application">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
				><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
					d="M368.4 18.34C390.3-3.526 425.7-3.526 447.6 18.34L493.7 64.4C515.5 86.27 515.5 121.7 493.7 143.6L437.9 199.3L312.7 74.06L368.4 18.34zM417.4 224L371.4 377.3C365.4 397.2 350.2 413 330.5 419.6L66.17 508.2C54.83 512 42.32 509.2 33.74 500.9L187.3 347.3C193.6 350.3 200.6 352 207.1 352C234.5 352 255.1 330.5 255.1 304C255.1 277.5 234.5 256 207.1 256C181.5 256 159.1 277.5 159.1 304C159.1 311.4 161.7 318.4 164.7 324.7L11.11 478.3C2.809 469.7-.04 457.2 3.765 445.8L92.39 181.5C98.1 161.8 114.8 146.6 134.7 140.6L287.1 94.6L417.4 224z"
				/></svg
			>
		</NavButton>
	</div>
	<div class="mr-2" on:click={() => goto('/about')}>
		<NavButton text="About">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
				><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
					d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s13.1-32 32-32c17.1 0 32 14 32 32S273.1 400 256 400zM325.1 258L280 286V288c0 13-11 24-24 24S232 301 232 288V272c0-8 4-16 12-21l57-34C308 213 312 206 312 198C312 186 301.1 176 289.1 176h-51.1C225.1 176 216 186 216 198c0 13-11 24-24 24s-24-11-24-24C168 159 199 128 237.1 128h51.1C329 128 360 159 360 198C360 222 347 245 325.1 258z"
				/></svg
			>
		</NavButton>
	</div>
	<div class="mr-6">
		<a href="https://github.com/turtlebasket/chainrec" target="_blank">
			<NavButton text="GitHub">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"
					><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
						d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
					/></svg
				>
			</NavButton>
		</a>
	</div>
</div>
