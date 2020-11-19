<script>
	import CDialog from './components/CDialog.svelte';
	import { onMount } from 'svelte';
	let wcqcVisible = false;

	let pad = function (num) {
		return num < 10 ? `0${num}` : num;
	};

	const socials = [{
		id: 'wechat',
		label: 'Wechat',
		action: () => {
			wcqcVisible = true;
		}
	}, {
		id: 'weibo',
		label: 'Weibo',
		url: 'https://weibo.com/1768830500/profile?topnav=1&wvr=6&is_all=1'
	}, {
		id: 'neteasemusic',
		label: 'Netease Music',
		url: 'https://music.163.com/#/user/home?id=261618415'
	}, {
		id: 'codepen',
		label: 'Code Pen',
		url: 'https://codepen.io/glorywong'
	}, {
		id: 'facebook',
		label: 'Facebook',
		url: 'https://www.facebook.com/glorywongzhaohui'
	}, {
		id: 'twitter',
		label: 'Twitter',
		url: 'https://twitter.com/glorywong1001'
	}, {
		id: 'instagram',
		label: 'Instagram',
		url: 'https://www.instagram.com/glorywong1001/'
	}, {
		id: 'github',
		label: 'Github',
		url: 'https://github.com/glorywong'
	}, {
		id: 'email',
		label: 'Email',
		url: 'mailto:glorywong1001@gmail.com'
	}];

	const projects = [{
		label: '孝感新冠疫情',
		url: '/2019ncov-xiaogan/',
    image: 'https://i.ibb.co/F4xxhSL/xiaogan-logo-64-64.png'
	}];

	let playerEle, profileEle;
	onMount(() => {
		function exePlay() {
			playerEle.play();
		}

		function exePause() {
			playerEle.pause();
		}

		profileEle.addEventListener('mouseover', exePlay);
		profileEle.addEventListener('mouseleave', exePause);
		profileEle.addEventListener('touchstart', exePlay);
		profileEle.addEventListener('touchend', exePause);
	});

	let fuck = 'shit';
</script>

<main>
	<audio bind:this="{playerEle}" loop="true" preload="auto" src="./public/GeiNiDeAi.mp3"></audio>
	<div class="show">
		<div class="profile" bind:this="{profileEle}">
			<div class="photo">
			</div>
		</div>
		<div class="socials-box">
			<ul class="socials-list">
				{#each socials as { id, label, url, action }}
				<li class="socials-list__item">
					{#if url}
						<a href={url} target="_blank" class={id}>{ label }</a>
					{:else}
						<a href="javascript:void(0)" on:click={action} class={id}>{label}</a>
					{/if}
				</li>
				{/each}
			</ul>
		</div>
	</div>
	<CDialog bind:visible="{wcqcVisible}">
		<img src="./public/wechatqrcode.jpg" alt="WeChat QR Code" width="100%" height="100%">
	</CDialog>
	
</main>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	.show {
		display: flex;
		flex-direction: column;
		height: 50vh;
		max-height: 480px;
		border-radius: 4px;
		background-color: white;
		overflow: hidden;
	}

	.profile {
		flex-grow: 1;
		.photo {
			width: 100%;
			height: 100%;
			background: url('https://i.ibb.co/b3jrWFG/2c6afa4c998140482851ec2bc6c94f3e.jpg') no-repeat;
			background-size: contain;
			background-position: center;
		}
	}

	.socials-box {
		.socials-list {
			list-style-type: none;
			display: flex;
			flex-wrap: wrap;
			/* box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.2); */
			&__item {
				display: flex;
				a {
					padding: 6px 10px;
					color: #666;
					text-decoration: none;
					transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
					transform-origin: center bottom;
					&:hover {
						transform: scaleY(2);
					}

					&.wechat {
						color: #F7F7F7;
						background: #62D276;
					}

					&.weibo {
						color: #CD3235;
						background: #F7F7F7;
					}

					&.neteasemusic {
						color: #F7F7F7;
						background: #D23E31;
					}

					&.codepen {
						color: #F7F7F7;
						background: #0A0A08;
					}

					&.facebook {
						color: #F7F7F7;
						background: #3275E4;
					}

					&.twitter {
						color: #F7F7F7;
						background: #489CE4;
					}

					&.instagram {
						color: #F7F7F7;
						background: #6F40A5;
					}

					&.github {
						color: #F7F7F7;
						background: #1B1E22;
					}

					&.email {
						color: #F7F7F7;
						background: gray;
					}
				}
			}
		}
	}

	@media (max-width: 777px) {
		.show {
			height: auto;
			width: 90vw;
			flex-direction: row-reverse;

			.socials-list {
				flex-direction: column;
				&__item {
					a {
						transform-origin: left center;
						&:hover {
							transform: scaleX(1.5);
						}
					}
				}
			}
		}
	}

	@media (max-width: 430px) {
		.show {
			.photo {
				img {
					height: max-content;
				}
			}
		}
	}
</style>
