let config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
}

let platforms

let player

let cursors

let stars
let score = 0
let scoreText

let bombs

let game = new Phaser.Game(config)

function preload() {
	this.load.image('sky', 'assets/bck.png')
	this.load.image('ground', 'assets/platform.png')
	this.load.image('ground2', 'assets/platform2.png')
	this.load.image('light', 'assets/light.png')

	this.load.image('star', 'assets/star.png')
	this.load.image('bomb', 'assets/bomb.png')
	this.load.spritesheet('dude', 'assets/dude.png', {
		frameWidth: 75,
		frameHeight: 100,
		setScale: 1
	})
}

function create() {
	this.add.image(400, 300, 'sky')

	platforms = this.physics.add.staticGroup()
	// first number is X value
	// second is Y value
	// floor is Y value 590 ish

	platforms //bottom left floor
		.create(00, 590, 'ground')
		.setScale(0.5)
		.refreshBody()
	platforms //bottom floor 2nd from L
		.create(350, 590, 'ground')
		.setScale(0.5)
		.refreshBody()
	platforms //bottom floor 3rd from L
		.create(700, 590, 'ground')
		.setScale(0.5)
		.refreshBody()
	platforms //bottom middle platform
		.create(300, 430, 'ground2')
		.setScale(0.5)
		.refreshBody()

	platforms //left most platform
		.create(80, 275, 'ground2')
		.setScale(0.5)
		.refreshBody()

	platforms //right platform
		.create(750, 300, 'ground2')
		.setScale(0.75)
		.refreshBody()
	platforms //right platform
		.create(400, 120, 'ground2')
		.setScale(0.25)
		.refreshBody()
	// player.setscale(0.6)

	player = this.physics.add.sprite(400, 450, 'dude')
	player.setBounce(0.2)
	player.setCollideWorldBounds(true)

	this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	})

	this.anims.create({
		key: 'turn',
		frames: [{ key: 'dude', frame: 4 }],
		frameRate: 20
	})

	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	})

	this.physics.add.collider(player, platforms)

	cursors = this.input.keyboard.createCursorKeys()

	stars = this.physics.add.group({
		key: 'star',
		repeat: 12,
		setXY: { x: 12, y: -1000, stepX: 70 }
	})

	stars.children.iterate(star => {
		star.setBounceY(Phaser.Math.FloatBetween(0.1, 0.79))
	})

	this.physics.add.collider(stars, platforms)

	this.physics.add.overlap(player, stars, collectStar, null, this)

	scoreText = this.add.text(16, 16, 'score: 0', {
		fontSize: '32px',
		fill: '#000'
	})

	bombs = this.physics.add.group()

	this.physics.add.collider(bombs, platforms)

	this.physics.add.collider(player, bombs, hitbomb, null, this)
}

function collectStar(player, star) {
	star.disableBody(true, true)

	score += 10
	scoreText.setText('Score: ' + score)

	if (stars.countActive(true) === 0) {
		stars.children.iterate(star => {
			star.enableBody(true, star.x, 0, true, true)
		})

		let bombX =
			player.x < 400
				? Phaser.Math.Between(400, 800)
				: Phaser.Math.Between(0, 400)

		let bomb = bombs.create(bombX, 16, 'bomb')
		bomb.setBounce(1)
		bomb.setCollideWorldBounds(true)
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
		bomb.allowGravity = false
	}
}

function hitbomb(player, bomb) {
	this.physics.pause()

	player.setTint(0xff0000)

	player.anims.play('turn')

	gameOver = true
}

function update() {
	if (cursors.left.isDown) {
		player.setVelocityX(-160)

		player.anims.play('left', true)
	} else if (cursors.right.isDown) {
		player.setVelocityX(160)

		player.anims.play('right', true)
	} else {
		player.setVelocityX(0)

		player.anims.play('turn')
	}

	if (cursors.up.isDown && player.body.touching.down) {
		player.setVelocityY(-330)
	}
}
