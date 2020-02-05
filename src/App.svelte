<script>
	import Social from './components/Social.svelte'

	let pad = function (num) {
		return num < 10 ? `0${num}` : num;
	}

	let time;

	let getCurrentTime = function() {
		let time;
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		return time = `${year}-${pad(month)}-${pad(day)} ${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
	}

	setInterval(() => {
		time = getCurrentTime();
	}, 1000);
</script>

<main>
	<header>
		<div class="info">
			<h1 class="info__title">ZhaoZhao Today</h1>
			<h1 class="info__des">Web developer, prefer cooking Hubei-style foods. I am a languages enthusiast. Sometimes, I draw and climb mountain. Pingpong is one of my sport hobbies.</h1>
			<Social/>
		</div>
		<div class="profile">
			<!-- <img class="profile__img" src="https://i.ibb.co/WFtDqbN/profile.png" alt="My profile image"> -->
		</div>
	</header>
	<article></article>
	<footer>Zhaozhao today @ {time}</footer>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	header {
		$lg: linear-gradient(to right, #ff3e30, #f7b529, #179c52, #176bef);
		background: $lg, $lg;
		background-size: 100% 5px, 100% 5px;
		background-position: 0 0, 0 bottom;
		background-repeat: no-repeat;
		padding: 30px;
		color: #444;
		display: flex;

		h1 {
			font: inherit;
		}

		.info {
			&__title {
				font-size: 2em;
				margin-bottom: 30px;
			}
			&__des {
				font-size: 1em;
				line-height: 1.4em;
			}
		}

		.profile {
			&__img {
				width: 100%;
			}
		}
	}

	article {
		background-color: #444;
    padding: 20px;
		box-shadow: inset 0 0px 5px 2px rgba(0, 0, 0, 0.4);
		flex-grow: 1;
	}

	footer {
		background-color: #333;
    color: white;
    padding: 10px 0;
    text-align: center;
	}

	@media (max-width: 54em) {
		header {
			.info {

			}
		}
	}

	@media (min-width: 40em) {
		header {
			.info {
				&__title {
					font-size: 3.9em;
				}
				&__des {
					font-size: 1.3em;
				}
			}
		}
	}
</style>