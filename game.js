jQuery(document).ready(function($) {

	var level = 1;
	var levelDamage = 500;
	var score = 0;

	var enemyTypes = [];

	$('#enemyObjects .enemy').each(function(index, obj) {
		var $obj = $(obj);
		enemyTypes.push ( $obj.data('type') );
	});
 
	var castleOffset = $('#castle').offset();

	var castleY = castleOffset.left + $('#castle').width() + 5;

	var screenHeight = $(document).height();
	var screenWidth = $(document).width();

	var totalGold = 0;
	var score = 0;

	var enemyID = 1;
	var enemyObjWidth = 30;
	var enemyObjHeight = 30;

	var	bulletID = 1;
	var bulletObjWidth = 5;
	var bulletObjHeight = 5;

	var defenderID = 1;
	var defenderObjWidth = 20;
	var defenderObjHeight = 20;
	
	var minerID = 1;
	var minerObjWidth = 20;
	var minerObjHeight = 20;

	init();

	function init() {
		addDefender('soldier', 430, 490);
		addDefender('soldier', 430, 450);
		addDefender('soldier', 430, 400);
		addMiner('normal', 430, 50);
		addEnemy( 'troll', 440, 0 );
		addEnemy( 'troll', 470, 0 );
	}
	
	function moveEnemy() {
		$('#wrapper .enemy').each( function( index, obj ) {
			var $obj = $(obj);
			var id = $obj.data('id');
			var speed = $obj.data('speed');
			var damage = $obj.data('damage');
			var health = $obj.data('health');
			var position = $obj.offset();
			var top = position.top;
			var left = position.left;
			if ( left > castleY ) {
				$obj.offset( {top: top, left: left - speed });
			} else {
				$obj.addClass('arrived');
			}
		});
	}

	function moveBullet() {
		$('#wrapper .bullet').each( function( index, obj ) {
			var $obj = $(obj);
			var id = $obj.data('id');
			var speed = $obj.data('speed');
			var damage = $obj.data('damage');
			var width = $obj.data('width');
			var position = $obj.offset();
			var top = position.top;
			var left = position.left;
			if ( left < screenWidth - width ) {
				$obj.offset( {top: top, left: left + speed });
			} else {
				$obj.remove();
			}
		});
	}


	function mine() {

		var miners = $('#wrapper .miner');

		miners.each(function(index, obj) {

			var $obj = $(obj);
			var max = $(obj).data('capacity');
			var gold = $(obj).data('gold');
			var mineRate = $(obj).data('minerate');

			if ( gold < max ) {
				$obj.data( 'gold', gold + mineRate );
				if ( gold > max ) {
					gold = max;
				}
			} else {
				$obj.addClass('full-gold');
			}

		});
	}

	$(document).on('click', '#wrapper .miner', function(event) {
		var $this = $(this);
		totalGold += $this.data('gold');
		$('#gold-value').text(totalGold);
		$this.data('gold', 0);
		$this.removeClass('full-gold');
	});

	function pauseEnemy( enemy ) {
		var oldSpeed = enemy.data('speed');
		enemy.attr( 'data-oldSpeed', oldSpeed );
		enemy.data( 'speed', 0 );
	}

	function resume( enemy ) {
		var speed = enemy.data('oldSpeed');
		enemy.data('speed', speed );
	}

	function addEnemy( type = 'soldier', bottom = 0, right = 0 ) {
		var $enemy = $('#enemyObjects .enemy.' + type );
		$enemy.attr('data-id', enemyID);
		var posY = screenHeight - bottom - enemyObjHeight;
		var posX = screenWidth - right - enemyObjWidth;
		var $newEnemy = $enemy.clone();
		$newEnemy.offset({ top: posY, left: posX });
		$newEnemy.appendTo('.wrapper');
		enemyID++;
	}

	function addBullet( type = 'arrow', bottom = 0, left = 0 ) {
		var $bullet = $('#bulletObjects .bullet.' + type );
		$bullet.attr('data-id', bulletID);
		var posY = screenHeight - bottom;
		$newBullet.offset({ top: posY - bulletObjHeight, left: left });
		var $newBullet = Bullet.clone();
		$newBullet.appendTo('.wrapper');
		bulletID++;
	}


	function addDefender( type = 'archer', bottom = 0, left = 0 ) {
		var $defender = $('#defenderObjects .defender.' + type );

		$defender.attr('data-id', defenderID);
		var posY = screenHeight - bottom;
		var $newDefender = $defender.clone()
		$newDefender.offset({ top: posY - defenderObjHeight, left: left });
		$newDefender.appendTo('.wrapper');
		defenderID++;
	}

	function addMiner( type = 'normal', bottom = 0, left = 0 ) {
		var $miner = $('#minerObjects .miner.' + type );

		$miner.attr('data-id', minerID);
		var posY = screenHeight - bottom;
		$miner.offset({ top: posY - minerObjHeight, left: left });
		$miner.clone().appendTo('.wrapper');
		minerID++;
	}

	function generateEnemy() {

		var enemy = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
		var levelTotalDamage = levelDamage * level;
		addEnemy( enemy, 0, 0 );

	}


	function meleeFight(defender,atacker) {
		var damagDefender = defender.data('damage');
		var healthDefender = defender.data('health');

	}

	function attack(){
		var enemyAtCastle = $('.arrived');
		var archerAtCastle = $('#wrapper .archer');
		var soldierAtCastle = $('#wrapper .soldier');
		if ( enemyAtCastle.length < 1 ) {
			return false;
		}
		var enemyIndex = 0;
		archerAtCastle.each(function(index, obj) {

			var $obj = $(obj);
			var archerDamage = $obj.data('damage');
			var enemy = enemyAtCastle.get(enemyIndex);
			var $enemy = $(enemy);
			if ( $enemy.length <= 0 ) {
				return false;
			}
			var enemyHealth = $enemy.data('health');
			var type = $enemy.data('type');
			var initialHealth = $('#enemyObjects .enemy.' + type ).data('health');
			enemyHealth = enemyHealth - archerDamage;
			var percent = enemyHealth / initialHealth * 100;
			$enemy.find('.fill').css('width', 'calc('+percent+'% - 2px)');
			$enemy.addClass('flash');

			if ( enemyHealth <= 0 ) {
				enemyIndex++;
				enemyHealth = 0;
			}
			$enemy.data('health', enemyHealth);
			console.log('archer attacked enemy. enemy('+ enemyIndex +') health:' + enemyHealth );
		});

		soldierAtCastle.each(function(index, obj) {

			var $obj = $(obj);
			var soldierDamage = $obj.data('damage');
			var enemy = enemyAtCastle.get(enemyIndex);
			var $enemy = $(enemy);
			if ( $enemy.length <= 0 ) {
				return false;
			}
			var enemyHealth = $enemy.data('health');
			var type = $enemy.data('type');
			var initialHealth = $('#enemyObjects .enemy.' + type ).data('health');
			enemyHealth = enemyHealth - soldierDamage;
			var percent = enemyHealth / initialHealth * 100;
			$enemy.find('.fill').css('width', 'calc('+percent+'% - 2px)');
			$enemy.addClass('flash');
			setTimeout(function() {
				$enemy.removeClass('flash');
			}, 200);

			if ( enemyHealth <= 0 ) {
				enemyIndex++;
				enemyHealth = 0;
			}
			$enemy.data('health', enemyHealth);
			console.log('soldier attacked enemy. enemy('+ enemyIndex +') health:' + enemyHealth );
		});

		var soldierIndex = 0;
		enemyAtCastle.each(function(index, obj) {

			var $obj = $(obj);
			var enemyDamage = $obj.data('damage');
			var soldier = soldierAtCastle.get(soldierIndex);
			var $soldier = $(soldier);
			if ( $soldier.length <= 0 ) {
				// attack wall
				var wallHealth = $('#wall').data('health');
				var initialWallHealth = $('#wall-object').data('health');
				wallHealth = wallHealth - enemyDamage;
				var percent = wallHealth / initialWallHealth * 100;
				$('#wall').find('.fill').css('width', 'calc('+percent+'% - 2px)');
				$('#wall').addClass('flash');
				setTimeout(function() {
					$('#wall').removeClass('flash');
				}, 200);
				$('#wall').data('health', wallHealth);
				return;
			}
			var soldierHealth = $soldier.data('health');
			var initialHealth = $('#defenderObjects .defender.soldier' ).data('health');
			soldierHealth = soldierHealth - enemyDamage;
			var percent = soldierHealth / initialHealth * 100;
			$soldier.find('.fill').css('width', 'calc('+percent+'% - 2px)');
			$soldier.addClass('flash');
			setTimeout(function() {
				$soldier.removeClass('flash');
			}, 200);

			if ( soldierHealth <= 0 ) {
				soldierIndex++;
				soldierHealth = 0;
			}
			$soldier.data('health', soldierHealth);
			console.log('enemy attacked soldier. soldier('+ soldierIndex +') health:' + soldierHealth );
		});

		enemyAtCastle.each(function(index, obj) {
			if ( $(obj).data('health') <= 0 ) {
				var type = $(obj).data('type');
				$(obj).remove();

				score = score + $('#enemyObjects .enemy.' + type ).data('health');
				$('#score-value').text(score);
			}
		});

		soldierAtCastle.each(function(index, obj) {
			if ( $(obj).data('health') <= 0 ) {
				$(obj).remove();
			}
		});

		
		console.log('-----------------------');
		//defenderr attack enemy

		//enemy attck deender

		// remmove object
	}


	// function archerAttack() {

	// }



	function step() {

		moveEnemy();
		moveBullet();

	    window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);

	// mine
	setInterval( mine, 1000);
	setInterval( attack, 1000);
	// setInterval( generateEnemy, 1000);



});