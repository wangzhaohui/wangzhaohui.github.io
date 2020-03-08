<script>
	import Social from './components/Social.svelte'
	import Projects from './components/Projects.svelte'
	import { onMount } from 'svelte'

	let pad = function (num) {
		return num < 10 ? `0${num}` : num;
	}

	const socials = [{
		label: 'Wechat'
	}, {
		label: 'Weibo',
		url: 'https://weibo.com/1768830500/profile?topnav=1&wvr=6&is_all=1'
	}, {
		label: 'Netease Music',
		url: 'https://music.163.com/#/user/home?id=261618415'
	}, {
		label: 'Code Pen',
		url: 'https://codepen.io/glorywong'
	}, {
		label: 'Facebook',
		url: 'https://www.facebook.com/glorywongzhaohui'
	}, {
		label: 'Twitter',
		url: 'https://twitter.com/glorywong1001'
	}, {
		label: 'Instagram',
		url: 'https://www.instagram.com/glorywong1001/'
	}, {
		label: 'Github',
		url: 'https://github.com/glorywong'
	}, {
		label: 'Email',
		url: 'mailto:glorywong1001@gmail.com'
	}];

	const projects = [{
		label: '孝感新冠疫情',
		url: '/2019ncov-xiaogan/',
    image: 'https://i.ibb.co/F4xxhSL/xiaogan-logo-64-64.png'
	}];
</script>

<div class="body">
	<header>
		Zhao Zhao Today @2020
	</header>
	<main>
		<div class="profile">
			<div class="info">
				Web developer, enjoy cooking hubei-style food, I'm a languages enthusiast.
			</div>
			<div class="socials-box">
				<ul class="socials">
				{#each socials as { label, url }}
				<li class="socials__item">
					<a href={url} target="_blank">
						{label}
					</a>
				</li>
				{/each}
				</ul>
			</div>
		</div>
		<div class="art"></div>
	</main>
</div>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	.body {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;

		header {
			height: 2em;
			border-bottom: 5px solid;
			border-image: linear-gradient(to right, red ,yellow, green, blue) 5;
			display: flex;
			justify-content: center;
			align-items: center;
			font-family: 'Pacifico';
		}

		main {
			display: flex;
			flex-grow: 1;
			.profile, .art {
				padding: 20px;
			}
			.profile {
				width: 50%;
				background: black;
				display: flex;
				flex-direction: column;

				.info {
					display: flex;
					margin-bottom: 10px;
					justify-content: flex-end;
				}

				.socials-box {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					ul li {
						text-align: right;
						&:not(:last-child) {
							margin-bottom: 10px;
						}
						a {
							color: #eee;
						}
					}
				}
			}
			.art {
				flex-grow: 1;
				background: linear-gradient(to right, #303F9F, #4527A0);
			}
		}
	}

	@media (max-width: 500px) {
		.body {
			main {
				flex-direction: column;
				.profile {
					width: 100%;
					.socials-box {
						justify-content: flex-start;
						ul li {
							text-align: left;
						}
					}
				}
			}
		}
	}
</style>