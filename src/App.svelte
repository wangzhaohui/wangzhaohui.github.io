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

<main>
	<div class="show">
		<div class="photos-gallery">
			<div class="profile-box">
				<img src="https://i.ibb.co/b3jrWFG/2c6afa4c998140482851ec2bc6c94f3e.jpg" alt="profile photo">
				<div class="profile">
					<div class="title">Zhaozhao@Today</div>
					<div class="desc">Web developer, Hubei-style food cook, languages enthusiast, C-pop and Cantonpop lover.</div>
				</div>
			</div>
		</div>
		<div class="music-player-box">
			<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=322 height=52
				src="//music.163.com/outchain/player?type=2&id=112654&auto=0&height=32" title="player"></iframe>
		</div>
		<div class="socials-box">
			<ul class="socials-list">
				{#each socials as { label, url }}
				<li class="socials-list__item"><a href={url} target="_blank">{ label }</a></li>
				{/each}
			</ul>
		</div>
	</div>
	
</main>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	.photos-gallery {
		display: flex;
		justify-content: center;

		.profile-box {
			border-radius: 5px;
			overflow: hidden;
			background-color: white;
			display: flex;
			width: 30em;

			.profile {
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 10px;
				.title {
					font-family: 'Pacifico';
					line-height: 3em;
				}
				.desc {
					line-height: 1.3em;
				}
			}
		}
	}

	.music-player-box {
		display: flex;
		justify-content: center;
	}

	.socials-list {
		list-style-type: none;
		display: flex;
		flex-wrap: wrap;
		box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.2);
		border-radius: 2px;
		background-color: white;
		margin: 0 10px;
		&__item {
			display: flex;
			a {
				padding: 6px 10px;
				color: #666;
				text-decoration: none;
				transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
				&:hover {
					transform: scale(1.1);
				}
			}
		}
	}

	@media (max-width: 500px) {
		.photos-gallery {
			.profile-box {
				flex-direction: column;
				width: 15em;
				.title {
					text-align: center;
				}
			}
		}
	}
</style>