enchant();
window.onload = function() {
	var game = new Game(320, 320), hero, score = 0, SPEED = 2, label = new Label('SCORE:0');
	var Particle = enchant.Class.create(enchant.Sprite, {
		initialize: function (color) {
			enchant.Sprite.call(this, 4, 4);
			this.image = new Surface(this.width, this.height);
			this.image.context.fillStyle = color;
			this.image.context.fillRect(0, 0, this.width, this.height);
			this.life = 10;
			this.addEventListener('enterframe', function() {
				this.move();
				if (--this.life < 0) {
					this.parentNode.removeChild(this);
				}
			});
		},
		move: function() {
			this.x += this.vx;
			this.y += this.vy;
			this.vx *= 0.9;
			this.vy *= 0.9;
		}
	});
	var Character = enchant.Class.create(enchant.Sprite, {
		initialize: function (type) {
			enchant.Sprite.call(this, 18, 18);
			this.image = new Surface(18, 18);
			this.image.context.font = "18px sans-serif";
			this.image.context.fillStyle = "orange";
			this.image.context.fillText(type, 0, this.height);
			this.type = type;
			this.theta = Math.random() * Math.PI;
			this.addEventListener('enterframe', function() {
				this.move();
			});
		},
		move: function() {
			--this.y;
			this.theta += 0.1;
			this.x += Math.sin(this.theta) * 3;
			if (this.y < -this.height) {
				this.parentNode.removeChild(this);
			} else if (!!hero && this.within(hero, this.width * 2 / 3)) {
				if (hero.type != this.type) {
					var scene = game.currentScene;
					game.end(score);
				} else {
					++score;
					label.text = 'SCORE:' + score;
					this.explode();
					hero.changeType();
				}
			}
		},
		explode: function() {
			var i, particle, color = chooseColor();
			for (i = 0; i < 8; ++i) {
				particle = new Particle(color);
				particle.x = this.x + this.width/2 - particle.width/2;
				particle.y = this.y + this.height/2 - particle.height/2;
				particle.vx = Math.cos(Math.PI * i / 4) * 3;
				particle.vy = Math.sin(Math.PI * i / 4) * 3;
				this.parentNode.addChild(particle);
			}
			this.parentNode.removeChild(this);
		}
	});
	var Hero = enchant.Class.create(Character, {
		initialize: function (type) {
			enchant.Sprite.call(this, 18, 18);
			this.image = new Surface(18, 18);
			this.image.context.font = "18px sans-serif";
			this.image.context.fillStyle = "red";
			this.image.context.fillText(type, 0, this.height);
			this.theta = 0.0;
			this.type = type;
			this.addEventListener('enterframe', function() {
				this.move();
			});
		},
		move: function() {
			if (game.input.up) {
				this.y -= SPEED;
			}
			if (game.input.down) {
				this.y += SPEED;
			}
			if (game.input.left) {
				this.x -= SPEED;
			}
			if (game.input.right) {
				this.x += SPEED;
			}
			this.x = Math.min(320 - this.width, Math.max(0, this.x));
			this.y = Math.min(320 - this.height, Math.max(0, this.y));
		},
		changeType: function() {
			if (this.type === 'た') {
				this.type = 'ま';
			} else if (this.type === 'ま') {
				this.type = 'や';
			} else {
				this.type = 'た';
			}
			this.image.clear();
			this.image.context.fillText(this.type, 0, this.height);
		}
	});
	game.onload = function() {
		game.currentScene.backgroundColor = '#000000';
		var pad = new Pad();
		pad.x = pad.y = 320 - 100;
		game.currentScene.addChild(pad);

		hero = new Hero('た');
		hero.x = hero.y = 160;
		game.currentScene.addChild(hero);

		label.color = '#ffffff';
		label.font = '18px sans-serif';
		game.currentScene.addChild(label);

		game.currentScene.addEventListener('enterframe', function (e) {
			if ((game.frame % 20) === 0) {
				for (var i = 0; i < 2; ++i) {
					var type = ['や','ま','た'][Math.floor(3 * Math.random())];
					var character = new Character(type);
					character.x = (Math.random() + i) * 160;
					character.y = 320;
					game.currentScene.addChild(character);
				}
			}
		});
	};
	game.start();
};

function chooseColor() {
	return 'hsl(' + Math.floor(Math.random() * 360) + ',50%,70%)';
}