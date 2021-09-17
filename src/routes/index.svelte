<script context="module">
	export async function load({ fetch }) {
		try {
			const response = await fetch(`/api/videos.json`);
			const data = await response.json();
			return {
				props: {
					videos: data
				}
			};
		} catch (e) {
			console.error(e);
			return {
				status: 500,
				error: e
			};
		}
	}
</script>

<script>
	import { Cloudinary } from '@cloudinary/url-gen';

	import { invalidate } from '$app/navigation';
	import { afterUpdate } from 'svelte';

	// Create and configure your Cloudinary instance.
	const cld = new Cloudinary({
		cloud: {
			cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
		}
	});

	function getVideo(video) {
		return cld.video(video.public_id);
	}

	export let videos = [];

	let myWidget;

	function openUploadWidget() {
		myWidget.open();
	}
	afterUpdate(() => {
		myWidget = cloudinary.createUploadWidget(
			{
				cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
				uploadPreset: 'demopresets'
			},
			(error, result) => {
				if (!error && result && result.event === 'success') {
					invalidate('/');
				}
			}
		);
	});
</script>

<svelte:head>
	<script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
</svelte:head>

<div class="main">
	<div class="px-4 sm:px-8 lg:px-16 xl:px-20 mx-auto">
		<!-- hero -->
		<div class="hero">
			<!-- hero headline -->
			<div class="hero-headline flex flex-col items-center justify-center pt-24 text-center">
				<h1 class=" font-bold text-3xl text-gray-900">SvelteKit video gallery</h1>
				<p class=" font-base text-base text-gray-600">Upload your own with the button below</p>

				<label
					class="w-64 flex flex-col items-center px-4 py-6 bg-white text-indigo-600 rounded-lg shadow-lg tracking-wide uppercase border border-indigo-600 cursor-pointer hover:bg-indigo-600 hover:text-white"
				>
					<svg
						class="w-8 h-8"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
					>
						<path
							d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
						/>
					</svg>

					<button on:click={openUploadWidget} class="mt-2 text-base leading-normal"
						>Select a video file</button
					>
				</label>
			</div>

			<section id="photos" class="my-5 grid grid-cols-1 md:grid-cols-4 gap-4">
				{#each videos as video}
					<div class="rounded-lg shadow-md hover:shadow-lg">
						<video
							controls
							class="rounded-lg shadow-md hover:shadow-lg w-full h-64 object-cover"
							src={getVideo(video).toURL()}
							sources={getVideo(video).sources}
							poster={getVideo(video).poster}
						>
							<track kind="captions" />
						</video>
					</div>
				{/each}
			</section>
		</div>

		<footer class="p-5 text-sm text-gray-600 text-center inline-flex items-center">
			<svg
				aria-hidden="true"
				focusable="false"
				data-prefix="fas"
				data-icon="heart"
				class="svg-inline--fa fa-heart fa-w-16 text-red-600 w-4 h-4 mr-4 align-middle"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				><path
					fill="currentColor"
					d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
				/></svg
			>
			<span
				>Made with <a
					href="https://tailwindcss.com/"
					target="_new"
					class="text-indigo-600 font-semibold">tailwindcss</a
				>
				and <a href="https://kit.svelte.dev" class="text-indigo-600 font-semibold">SvelteKit</a>
			</span>
		</footer>
	</div>
</div>
