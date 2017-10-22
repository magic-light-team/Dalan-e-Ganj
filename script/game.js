// Find the right method, call on correct element
function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}


jQuery(document).ready(function($) {

	$('#Dungeon-Lords-Title').trigger("play");

	var enemyTypes    = [];
	$('#enemyObjects .enemy').each(function(index, obj) {
		var $obj = $(obj);
		enemyTypes.push ( $obj.data('type') );
	});
 	var gameIsRunning     = 0;
	var level             = 1;
	var levelDamage       = 3;
	var remainLevel       = 0;
	var archerRange       = 400;
	var castleOffset      = $('#castle').offset();
	var castleY           = castleOffset.left + $('#castle').width() + 5;
	var screenHeight      = $('html').innerHeight();
	var screenWidth       = $('html').innerWidth();
	// Score
	var minedGold        = 0;
	var totalGold        = 0;
	var score            = 0;

	var archerValue      = 20;
	var minerValue       = 5;
	var swordsmanValue   = 10;
	var macemanValue     = 15;

	var enemyID           = 1;
	var enemyObjWidth     = 30;
	var enemyObjHeight    = 30;
	var	bulletID          = 1;
	var bulletObjWidth    = 5;
	var bulletObjHeight   = 5;
	var defenderID        = 1;
	var defenderObjWidth  = 20;
	var defenderObjHeight = 20;
	var minerID           = 1;
	var minerObjWidth     = 20;
	var minerObjHeight    = 20;
	var archerInitialposX = 560;
	var archerInitialposY = 462;
	var archerRow         = 1;
	var archerCol         = 1;
	var archerCount       = 1;
	
	var swordsmanRow         = 0;
	var swordsmanCol         = 0;
	var swordsmanCount       = 0;
	var swordsmanInitialPosX = 550;
	var swordsmanInitialPosY = 420;	

	var macemanRow         = 0;
	var macemanCol         = 0;
	var macemanCount       = 0;
	var macemanInitialPosX = 510;
	var macemanInitialPosY = 450;

	var minerRow         = 1;
	var minerCol         = 1;
	var minerCount       = 1;
	var minerInitialPosX = 50;
	var minerInitialPosY = 430;

	$('#start').on('click', function(event) {
		event.preventDefault();

		if ( $(this).hasClass('restart') ) {
			window.location = window.location;
		}

		// launchFullScreen(document.documentElement); // the whole page
		$('#Dungeon-Lords-Title').trigger("pause");
		$('#Oil-Rig').trigger("play");
		$(this).addClass('hide');
		if ( ! gameIsRunning ) {
			$('#wrapper').removeClass('hide');
			$('body').removeClass('game-over');
			$('body').removeClass('win');
			init();
		}
	});

	function init() {
		gameIsRunning = 1;
		level         = 1;
		levelDamage   = 3;
		totalGold     = 0;
		minedGold     = 0;
		score         = 0;
		enemyID       = 1;
		bulletID      = 1;
		defenderID    = 1;
		minerID       = 1;
		archerValue      = 20;
		minerValue       = 5;
		swordsmanValue   = 10;
		macemanValue     = 15;
		window.requestAnimationFrame(step);

		$('.miner-block .add-val').text(minerValue);
		$('.swordsman-block .add-val').text(swordsmanValue);
		$('.maceman-block .add-val').text(macemanValue);
		$('.archer-block .add-val').text(archerValue);
		addDefender('archer', archerInitialposX, archerInitialposY);

		addMiner('normal', minerInitialPosY, minerInitialPosX);
	}



	$('.archer-block').on('click', '.upgrade', function(event) {
		event.preventDefault();
		if ( $('.archer').data('level') >= 10 || totalGold < archerValue * $('.archer').data('level') ) {
			return;
		}
		totalGold -= archerValue * $('.archer').data( 'level' );
		$('.archer').data( 'level', $('.archer').data('level') + 1 );
		$('.archer').data( 'health', $('.archer').data('health') + 100 );
		$('.archer').data( 'damage', $('.archer').data('damage') + 20 );
		$(this).find('.level-num .value').text($('.archer').data('level'));
		if ( $('.archer').data('level') > 5 ) {
			$('.archer-block').addClass('high-level');
			$('.archer').addClass('high-level');
		}
		if ( $('.archer').data('level') > 9 ) {
			$('.archer-block').find('.level-num').text('max').css('margin-left','15px');
		}
		$('#gold-value').text(totalGold);
		$('.archer-block .upgrade-val').text( archerValue * $('.archer').data('level') );
		$('#level-up').trigger("play");
	});
	
	$('.swordsman-block').on('click', '.upgrade', function(event) {
		event.preventDefault();
		if ( $('.swordsman').data('level') >= 10 || totalGold < swordsmanValue * $('.swordsman').data('level') ) {
			return;
		}
		totalGold -= swordsmanValue * $('.swordsman').data( 'level' );
		$('.swordsman').data( 'level', $('.swordsman').data( 'level' ) + 1 );
		$('.swordsman').data( 'health', $('.swordsman').data( 'health' ) + 100 );
		$('.swordsman').data( 'damage', $('.swordsman').data( 'damage' ) + 10 );
		$(this).find('.level-num .value').text($('.swordsman').data('level'));
		if ( $('.swordsman').data('level') > 5 ) {
			$('.swordsman-block').addClass('high-level');
			$('.swordsman').addClass('high-level');
		}
		if ( $('.swordsman').data('level') > 9 ) {
			$('.swordsman-block').find('.level-num').text('max').css('margin-left','15px');
		}
		$('#gold-value').text(totalGold);
		$('.swordsman-block .upgrade-val').text( swordsmanValue * $('.swordsman').data('level') );
		$('#level-up').trigger("play");
	});	

	$('.maceman-block').on('click', '.upgrade', function(event) {
		event.preventDefault();
		if ( $('.maceman').data('level') >= 10 || totalGold < macemanValue * $('.maceman').data('level') ) {
			return;
		}
		totalGold -= macemanValue * $('.maceman').data( 'level' );
		$('.maceman').data( 'level', $('.maceman').data( 'level' ) + 1 );
		$('.maceman').data( 'health', $('.maceman').data( 'health' ) + 100 );
		$('.maceman').data( 'damage', $('.maceman').data( 'damage' ) + 10 );
		$(this).find('.level-num .value').text($('.maceman').data('level'));
		if ( $('.maceman').data('level') > 5 ) {
			$('.maceman-block').addClass('high-level');
			$('.maceman').addClass('high-level');
		}
		if ( $('.maceman').data('level') > 9 ) {
			$('.maceman-block').find('.level-num').text('max').css('margin-left','15px');
		}
		$('#gold-value').text(totalGold);
		$('.maceman-block .upgrade-val').text( macemanValue * $('.maceman').data('level') );
		$('#level-up').trigger("play");
	});

	$('.miner-block').on('click', '.upgrade', function(event) {
		event.preventDefault();
		if ( $('.miner').data('level') >= 10 || totalGold < minerValue * $('.miner').data('level') ) {
			// error gold is not enaugh
			return;
		}

		totalGold -= minerValue * $('.miner').data( 'level' );
		$('.miner').data( 'level', $('.miner').data('level') + 1 );
		$('.miner').data( 'minerate', $('.miner').data('minerate') + 1 );
		$('.miner').data( 'capacity', $('.miner').data('capacity') + 5 );
		$(this).find('.level-num .value').text($('.miner').data('level'));
		if ( $('.miner').data('level') > 5 ) {
			$('.miner-block').addClass('high-level');
			$('.miner').addClass('high-level');
		}
		if ( $('.miner').data('level') > 9 ) {
			$('.miner-block').find('.level-num').text('max').css('margin-left','15px');
		}

		$('#gold-value').text(totalGold);
		$('.miner-block .upgrade-val').text( minerValue * $('.miner').data('level') );
		$('#level-up').trigger("play");
	});

	$('.archer-block').on('click', '.add', function(event) {
		event.preventDefault();
		archerCol += 1;
		if ( archerCount >= 10 || totalGold < archerValue ) {
			return;
		}
		if ( archerCol > archerRow ) {
			archerCol = 1;
			archerRow += 1;
		}
		var newPosX = archerInitialposX - 42 * ( archerRow - 1 );
		var newPosY = archerInitialposY - 42 * ( archerCol - 1 );
		addDefender( 'archer', newPosX, newPosY );
		totalGold -= archerValue;
		$('#gold-value').text(totalGold);
		archerCount++;
		$('.archer-block').find('.num').text(archerCount);
		if ( archerCount >= 10 ) {
			$('.archer-block').find('.num').text('max').css('color', 'gold');
		}
		$('#unit-buy').trigger("play");
	});

	$('.swordsman-block').on('click','.add', function(event) {
		event.preventDefault();
		swordsmanRow += 1;
		if ( swordsmanCount >= 10 || totalGold < swordsmanValue ) {
			return;
		}
		if ( swordsmanRow > 5 ) {
			swordsmanRow = 1;
			swordsmanCol += 1;
		}
		var newPosX = swordsmanInitialPosX - 22 * ( swordsmanRow - 1 );
		var newPosY = swordsmanInitialPosY - 10 * ( swordsmanCol - 1 );

		addDefender( 'swordsman', newPosY, newPosX );
		totalGold -= swordsmanValue;
		$('#gold-value').text(totalGold);
		swordsmanCount++;
		$('.swordsman-block').find('.num').text(swordsmanCount);
		if ( swordsmanCount >= 10 ) {
			$('.swordsman-block').find('.num').text('max').css('color', 'gold');
		}
		$('#unit-buy').trigger("play");
	});

	$('.maceman-block').on('click','.add', function(event) {
		event.preventDefault();
		macemanRow += 1;
		if ( macemanCount >= 10 || totalGold < macemanValue ) {
			return;
		}
		if ( macemanRow > 5 ) {
			macemanRow = 1;
			macemanCol += 1;
		}
		var newPosX = macemanInitialPosX - 22 * ( macemanRow - 1 );
		var newPosY = macemanInitialPosY - 10 * ( macemanCol - 1 );

		addDefender( 'maceman', newPosY, newPosX );
		totalGold -= macemanValue;
		$('#gold-value').text(totalGold);
		macemanCount++;
		$('.maceman-block').find('.num').text(macemanCount);
		if ( macemanCount >= 10 ) {
			$('.maceman-block').find('.num').text('max').css('color', 'gold');
		}
		$('#unit-buy').trigger("play");
	});


	$('.miner-block').on('click','.add', function(event) {
		event.preventDefault();
		minerRow += 1;
		if ( minerCount >= 10 || totalGold < minerValue ) {
			return;
		}
		if ( minerRow > 5 ) {
			minerRow = 1;
			minerCol += 1;
		}
		var newPosX = minerInitialPosX + 50 * ( minerRow - 1 );
		var newPosY = minerInitialPosY - 40 * ( minerCol - 1 );

		addMiner( 'normal', newPosY, newPosX );
		totalGold -= minerValue;
		$('#gold-value').text(totalGold);
		minerCount++;
		$('.miner-block').find('.num').text(minerCount);
		if ( minerCount >= 10 ) {
			$('.miner-block').find('.num').text('max').css('color', 'gold');
		}
		$('#unit-buy').trigger("play");
	});

	$('.game-controls .main-control .pause').on('click', function(event) {
		if ( gameIsRunning ) {
			gameIsRunning = 0;	
		}

		$('#wrapper .miner').addClass('paused');
		$(this).hide();
		$('.game-controls .main-control .play').show();
		$('.game-controls .main-control .restart').show();
	});

	$('.game-controls .main-control .restart').on('click', function(event) {
		window.location = window.location;
	});

	$('.game-controls .main-control .play').on('click', function(event) {
		if ( ! gameIsRunning ) {
			gameIsRunning = true;	
		}
		$('#wrapper .miner').removeClass('paused');
		$(this).hide();
		$('.game-controls .main-control .pause').show();
		$('.game-controls .main-control .restart').hide();
	});

	
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
				if ( left < castleY + archerRange ) {
					$obj.addClass('inRange');
				}
				$obj.offset( {top: top, left: left - speed });
			} else {
				if ( ! $obj.hasClass('bat') ) {
					$obj.addClass('arrived');
				}
			}
		});
	}

	function moveBullet() {
		var enemyAtRange = $('.inRange');
		var enemyIndex = 0;
		$('#wrapper .bullet').each( function( index, obj ) {
			var $obj = $(obj);
			var enemy = enemyAtRange.get(enemyIndex);
			var $enemy = $(enemy);
			if ( $enemy.length <= 0 ) {
				$obj.remove();
				return false;
			}
			var enemyPosition = $enemy.offset();
			var id            = $obj.data('id');
			var speed         = $obj.data('speed');
			var damage        = $obj.data('damage');
			var width         = $obj.data('width');
			var position      = $obj.offset();
			var top           = position.top;
			var left          = position.left;
			var normalizeX    = $enemy.width() / 2;
			var normalizeY    = $enemy.height() / 2;

			if ( left < screenWidth - width && left < enemyPosition.left + 2 ) {

				var distanceLeft = ( enemyPosition.left - left + 2 );
				if ( top > enemyPosition.top + normalizeY ) {
					top -= Math.abs( ( top - enemyPosition.top - normalizeY ) / distanceLeft );
				} else if ( top < enemyPosition.top + normalizeY ) {
					top += Math.abs( ( top - enemyPosition.top - normalizeY ) / distanceLeft );
				}
				$obj.offset( {top: top , left: left + speed });

			} else {
				$obj.remove();
			}
		});
	}


	function mine() {
		var miners = $('#wrapper .miner');
		miners.each(function(index, obj) {
			var $obj     = $(obj);
			var max      = $(obj).data('capacity');
			var gold     = $(obj).data('gold');
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
		minedGold += $this.data('gold');

		if ( minedGold > 12000 ) {
			win();
		} else if ( minedGold > 10000 ) {
			$('.levels .gold-box').removeClass('hide');
		} else if ( minedGold > 8000 ) {
			$('.levels').addClass('level5');
			$('.levels').removeClass('level4');
			$('.levels .lvl5').removeClass('hide');
		} else if ( minedGold > 6000 ) {
			$('.levels').addClass('level4');
			$('.levels').removeClass('level3');
			$('.levels .lvl4').removeClass('hide');
		} else if ( minedGold > 4000 ) {
			$('.levels').addClass('level3');
			$('.levels').removeClass('level2');
			$('.levels .lvl3').removeClass('hide');
		} else if ( minedGold > 2000 ) {
			$('.levels').addClass('level2');
			$('.levels').removeClass('level1');
			$('.levels .lvl2').removeClass('hide');
		} else if ( minedGold > 1000 ) {
			$('.levels').addClass('level1');
			// $('.levels').removeClass('level1');
			$('.levels .lvl1').removeClass('hide');
		}
		$('#gold-value').text(totalGold);
		$this.data('gold', 0);
		$this.removeClass('full-gold');
		$('#get-coin').trigger("play");
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

	function addEnemy( type = 'demon', bottom = 0, right = 0 ) {
		var $enemy    = $('#enemyObjects .enemy.' + type );
		$enemy.attr('data-id', enemyID);
		var posY      = screenHeight - bottom - enemyObjHeight;
		var posX      = screenWidth - right - enemyObjWidth;
		var $newEnemy = $enemy.clone();
		$newEnemy.offset({ top: posY, left: posX });
		$newEnemy.appendTo('.wrapper');
		enemyID++;
	}

	function addBullet( type = 'arrow', bottom = 0, left = 0 ) {
		var $bullet = $('#bulletObjects .bullet.' + type );
		$bullet.attr('data-id', bulletID);
		var posY = screenHeight - bottom;
		var $newBullet = $bullet.clone();
		$newBullet.offset({ top: posY - bulletObjHeight, left: left });
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
		var $newMiner = $miner.clone();
		$newMiner.offset({ top: posY - minerObjHeight, left: left });
		$newMiner.appendTo('.wrapper');
		minerID++;
	}

	function generateEnemy() {
		
	    var levelTotalDamage = levelDamage * level;
	    levelTotalDamage -= remainLevel;
	    while(levelTotalDamage>0){
		    var enemy = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
		    var randomNum = Math.floor( 50*Math.random(50)-25);
		    if(enemy==='bat'){
		        addEnemy( enemy, 520+randomNum, 0 );
		    }else{
		        addEnemy( enemy, 420+randomNum, 0 );
		    }
		    
		    levelTotalDamage -= $('#enemyObjects .enemy.' + enemy ).data('damage');

		}
		remainLevel = -1 * levelTotalDamage;
	}

	function archerAttack( archerAtCastle, enemyAtRange, enemyIndex ) {
		archerAtCastle.each(function(index, obj) {
			var $obj = $(obj);
			var archerDamage = $obj.data('damage');
			var enemy = enemyAtRange.get(enemyIndex);
			var $enemy = $(enemy);
			if ( $enemy.length <= 0 ) {
				return false;
			}
			var enemyHealth = $enemy.data('health');
			var type = $enemy.data('type');
			var initialHealth = $('#enemyObjects .enemy.' + type ).data('health');
			enemyHealth = enemyHealth - archerDamage;
			// shooting
			shooting( $obj, $enemy );

			var percent = enemyHealth / initialHealth * 100;
			$enemy.find('.fill').css('width', 'calc(' + percent + '% - 2px)');
			$enemy.addClass('flash');
			setTimeout(function() {
				$enemy.removeClass('flash');
			}, 200);
			if ( enemyHealth <= 0 ) {
				enemyIndex++;
				enemyHealth = 0;
			}
			$enemy.data('health', enemyHealth);
			$('#arrowshot').trigger("play");
		});
	}

	function shooting( $obj, $enemy ) {
		var defenderPosition = $obj.offset();
		var enemyPosition    = $enemy.offset();
		var archerX          = defenderPosition.left;
		var archerY          = defenderPosition.top;
		var enemyX           = enemyPosition.left;
		var enemyY           = enemyPosition.top;
		addBullet( 'arrow', screenHeight - archerY - ($obj.height() / 2), archerX );
	}

	function swordsmanAttack( swordsmanAtCastle, enemyAtCastle, enemyIndex ) {
		
		swordsmanAtCastle.each(function(index, obj) {
			var $obj = $(obj);
			var swordsmanDamage = $obj.data('damage');
			var enemy = enemyAtCastle.get(enemyIndex);
			var $enemy = $(enemy);
			if ( $enemy.length <= 0 ) {
				return false;
			}
			var enemyHealth = $enemy.data('health');
			var type = $enemy.data('type');
			var initialHealth = $('#enemyObjects .enemy.' + type ).data('health');
			enemyHealth = enemyHealth - swordsmanDamage;
			var percent = enemyHealth / initialHealth * 100;
			$enemy.find('.fill').css('width', 'calc(' + percent + '% - 2px)');
			$enemy.addClass('flash');
			setTimeout(function() {
				$enemy.removeClass('flash');
			}, 200);
			if ( enemyHealth <= 0 ) {
				enemyIndex++;
				enemyHealth = 0;
			}
			$enemy.data('health', enemyHealth);
		});
	}

	function gameOver() {
		if ( gameIsRunning ) {
			gameIsRunning = 0;
		}
		$('body').addClass('game-over');
		$('#wrapper').addClass('hide');
		$('#start').removeClass('hide').addClass('restart');
	}

	function win() {
		if ( gameIsRunning ) {
			gameIsRunning = 0;
		}
		$('body').addClass('win');
		$('#wrapper').addClass('hide');
		$('#start').removeClass('hide').addClass('restart');
	}

	function enemyAttack( enemyAtCastle, swordsmanAtCastle, swordsmanIndex ) {
		enemyAtCastle.each(function(index, obj) {
			var $obj = $(obj);
			var enemyDamage = $obj.data('damage');
			var swordsman = swordsmanAtCastle.get(swordsmanIndex);
			var $swordsman = $(swordsman);
			if ( $swordsman.length <= 0 ) {
				// attack wall
				$('#castle-hit').trigger("play");
				var wallHealth = $('#wall').data('health');
				var initialWallHealth = $('#wall-object').data('health');
				wallHealth = wallHealth - enemyDamage;
				var percent = wallHealth / initialWallHealth * 100;
				$('#wall').find('.fill').css('width', 'calc('+percent+'% - 2px)');
				var oldSRC = $('#wall img').attr('src');
				if ( wallHealth < 1 ) {
					gameOver();
				}
				if ( percent < 30 ) {
					oldSRC = 'images/wall-crack.png';
				}
				$('#wall img').attr('src', 'images/wall-w.png');
				setTimeout(function() {
					$('#wall img').attr( 'src', oldSRC );
				}, 100);
				$('#wall').data('health', wallHealth);
				return;
			}
			var swordsmanHealth = $swordsman.data('health');
			var initialHealth = $('#defenderObjects .defender.swordsman' ).data('health');
			swordsmanHealth = swordsmanHealth - enemyDamage;
			var percent = swordsmanHealth / initialHealth * 100;
			$swordsman.find('.fill').css('width', 'calc('+percent+'% - 2px)');
			$swordsman.addClass('flash');
			setTimeout(function() {
				$swordsman.removeClass('flash');
			}, 200);

			if ( swordsmanHealth <= 0 ) {
				swordsmanIndex++;
				swordsmanHealth = 0;
			}
			$swordsman.data('health', swordsmanHealth);
		});
	}

	function attack(){
		var enemyAtCastle = $('.arrived');
		var enemyAtRange = $('.inRange');
		var swordsmanAtCastle = $('#wrapper .swordsman');
		var archerAtCastle = $('#wrapper .archer');
		if ( enemyAtCastle.length < 1 && enemyAtRange.length < 1 ) {
			return false;
		}
		var enemyIndex = 0;
		var swordsmanIndex = 0;
		// Archer attack effect
		archerAttack( archerAtCastle, enemyAtRange, enemyIndex );
		// swordsman attack effect
		swordsmanAttack( swordsmanAtCastle, enemyAtCastle, enemyIndex );
		// Enemy attack effect
		enemyAttack( enemyAtCastle, swordsmanAtCastle, swordsmanIndex );
		// When an enemy dies
		$('#wrapper .enemy').each(function(index, obj) {
			if ( $(obj).data('health') <= 0 ) {
				var type = $(obj).data('type');
				$(obj).remove();
				if ( $(obj).hasClass('swordsman') ) {
					swordsmanCount--;
				} else if ( $(obj).hasClass('maceman') ) {
					swordsmanCount--;
				}
				score = score + $('#enemyObjects .enemy.' + type ).data('health');
				if(score>level*level*2000){
					level += 1;
					$('.level-name span').text(level);
				}
				$('#score-value').text(score);
			}
		});
		// When An swordsman dies
		swordsmanAtCastle.each(function(index, obj) {
			if ( $(obj).data('health') <= 0 ) {
				$(obj).remove();
			}
		});
	}

	function step() {
		if ( gameIsRunning ) {
			moveEnemy();
			moveBullet();
		}
		window.requestAnimationFrame(step);
	}

	// Mine
	setInterval( function() {
		if ( gameIsRunning ) {
			mine();
			attack();
			generateEnemy();
		}	
	}, 1000);
	// Attack
	// setInterval( attack, 1000);
	// setInterval( generateEnemy, 1000);



});