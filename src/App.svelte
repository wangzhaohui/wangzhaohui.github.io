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
	{#each socials as {label, url}, index}
		<a href={url} target="_blank" class="item item__social">
			<div class="label">{label}</div>
		</a>
	{/each}
	<div class="item item__profile">
		<div class="profile">
			<div class="profile__title">
				Zhao Zhao Today
			</div>
			<div class="profile__description">
				Web developer, prefer cooking Hubei-style food. I'm a launages entusiast. Sometimes I draw and climb mountains. Pingpong is one of my sport hobbies.
			</div>
			<div class="profile__picture"></div>
		</div>
	</div>
	{#each projects as {label, url, image} }
		<a href={url} target="_blank" class="item item__project"
	style="background-image: url({image})">
			<div class="label">{label}</div>
		</a>
	{/each}
</main>

<style lang="sass">
	main
		display: grid
		width: 100vmin
		height: 100vmin
		grid-template-rows: repeat(5, 1fr)
		grid-template-columns: repeat(6, 1fr)
		font-size: 18px
		grid-gap: 0.5em
		box-sizing: border-box
		padding: 0.5em

		.item
			background-color: white
			display: flex
			justify-content: center
			align-items: center
			transition: all 0.3s
			box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2), -1px -1px 5px rgba(0, 0, 0, 0.1)
			border-radius: 0.2em
			background:
				repeat: no-repeat
				size: contain
				position: center

			&, &:hover
				text-decoration: none
				cursor: pointer

			&:hover
				border-radius: 2em

			&__social
				.label
					text-align: center

			&__profile
				grid-row: 3 / span 2
				grid-column: 1 / 7
				background-color: #fff
				&:hover
					border-radius: 1em

				.profile
					display: grid
					width: 100%
					height: 100%
					padding: 2em
					box-sizing: border-box
					grid-template-rows: 1fr 1fr
					grid-template-columns: 4fr 1fr
					grid-template-areas: "title picture" "description picture"
					grid-gap: 1em
					&__title
						grid-area: title
						font-size: 2.5em
					&__description
						grid-area: description
						line-height: 1.5em
					&__picture
						grid-area: picture
						background:
							image: url('/public/profile.png')
							size: contain
							position: center
							repeat: no-repeat

			&__project
				.label
					text-align: center

	@media (max-width: 800px)
		main
			font-size: 15px

	@media (max-width: 640px)
		main
			height: 100vh
			grid-template-columns: repeat(5, 1fr)
			.item
				&__profile
					.profile
						grid-template-rows: 1fr 3fr
						&__title
							font-size: 1.5em
						&__description
							font-size: 1em
</style>