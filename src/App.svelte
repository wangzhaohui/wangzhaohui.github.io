<script>
	import Social from './components/Social.svelte'
	import Projects from './components/Projects.svelte'

	let pad = function (num) {
		return num < 10 ? `0${num}` : num;
	}
</script>

<main>
	<div class="sudoku">
		<div class="sudoku__item sudoku__item-socials">
			<Social></Social>
		</div>
		<div class="sudoku__item sudoku__item-profile">
			<img class="profile-img" src="/public/profile.png" alt="My profile image">
		</div>
		<div class="sudoku__item sudoku__item-projects">
			<a href='/2019ncov-xiaogan/' target="_blank">
				<div class="project-box">
					<div class="project-box__header"></div>
					<div class="project-box__title">孝感新冠肺炎</div>
				</div>
			</a>
		</div>
	</div>
</main>

<style lang="sass">
	main
		display: flex
		flex-direction: column
		height: 100%
		justify-content: center
		align-items: center
		font-size: 18px

	.sudoku
		display: grid
		width: 30em
		grid-template-rows: repeat(3, 1fr)
		grid-template-columns: 1.5fr 1fr 1fr
		gap: 1em

		&__item
			/* border: 1px solid #aaa */
			box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.1), -1px -1px 5px 2px rgba(0, 0, 0, 0.1)
			border-radius: 2em
			overflow: hidden;
			&-socials
				grid-row: 1 / last-line
				display: flex
				padding: 1.5em
				flex-direction: column
			&-profile
				grid-row: 2 / last-line
				grid-column: 2 / last-line
				padding: 0.5em
				display: flex
				justify-content: center
				align-items: center

				@keyframes huerotate
					from
						filter: hue-rotate(0)
					to
						filter: hue-rotate(360deg)

				.profile-img
					width: 100%
					animation: huerotate 10s infinite
			&-projects
				grid-column: 3 / last-line
				a
					display: inline-block
					width: 100%
					height: 100%
					text-decoration: none
					color: #333
					.project-box
						display: flex
						width: 100%
						height: 100%
						flex-direction: column
						&__header
							background:
								color: #7e57c2
								image: url('https://i.ibb.co/F4xxhSL/xiaogan-logo-64-64.png')
								size: contain
								repeat: no-repeat
								position: center
							height: 80%
							border-radius: 0 0 2em 2em
						&__title
							flex-grow: 1
							display: flex
							justify-content: center
							align-items: center
							font-size: 1em

	@media (max-width: 800px)
		main
			font-size: 15px

	@media (max-width: 600px)
		.sudoku
			grid-template-rows: 2fr 1fr 2fr
			grid-template-columns: 3fr 1fr 1fr
			width: 80%
			&__item
				&-projects
					grid-column: 2 / last-line
				&-profile
					grid-row: 3 / last-line

	@media (max-width: 420px)
		.sudoku
			grid-template-rows: 2fr 0fr 1fr
			grid-template-columns: 4fr 1fr 1fr
			&__item
				&-socials
					padding: 1em
				&-projects
					grid-column: 2 / last-line
</style>