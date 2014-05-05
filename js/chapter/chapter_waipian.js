/* preload images and audio */
var resource = [
	['characters/ochi.png', 'characters/cross.png'],
	['atk', 'beaten', 'hit']
];

/* dialog */
var dialog = {
	'begin': [{						//page 1
		'image': 'chapter1/1.jpg',	//background-image
		'position': '220px 0px',	//background-position
		'width': 300,
		'height': 300
	},{
		'image': 'chapter1/1.jpg',
		'position': '500px 0px',
		'width': 350,
		'height': 300
	},{
		'image': 'chapter1/1.jpg',
		'position': '600px 0px',
		'width': 350,
		'height': 300
	},{
		'image': 'chapter1/1.jpg',
		'position': '320px -300px',
		'width': 300,
		'height': 230
	},{
		'image': 'chapter1/1.jpg',
		'position': '620px -300px',
		'width': 350,
		'height': 230
	},{
		'image': 'chapter1/1.jpg',
		'position': '420px -530px',
		'width': 400,
		'height': 180
	},{
		'image': 'chapter1/1.jpg',
		'position': '420px -530px',
		'width': 400,
		'height': 330
	},{
		'image': 'chapter1/1.jpg',
		'position': '620px -530px',
		'width': 250,
		'height': 330
	},{								//page 2
		'image': 'chapter1/2.jpg',
		'position': '240px -60px',
		'width': 230,
		'height': 220
	},{
		'image': 'chapter1/2.jpg',
		'position': '395px -60px',
		'width': 205,
		'height': 220
	},{
		'image': 'chapter1/2.jpg',
		'position': '595px 0px',
		'width': 250,
		'height': 270
	},{
		'image': 'chapter1/2.jpg',
		'position': '595px -220px',
		'width': 600,
		'height': 250
	},{
		'image': 'chapter1/2.jpg',
		'position': '330px -430px',
		'width': 310,
		'height': 220
	},{
		'image': 'chapter1/2.jpg',
		'position': '590px -430px',
		'width': 310,
		'height': 220
	},{
		'image': 'chapter1/2.jpg',
		'position': '310px -610px',
		'width': 290,
		'height': 260
	},{
		'image': 'chapter1/2.jpg',
		'position': '610px -610px',
		'width': 340,
		'height': 330
	},{									//page 3
		'image': 'chapter1/3.jpg',
		'position': '270px 0px',
		'width': 250,
		'height': 320
	},{
		'image': 'chapter1/3.jpg',
		'position': '570px -50px',
		'width': 350,
		'height': 270
	},{
		'image': 'chapter1/3.jpg',
		'position': '370px -250px',
		'width': 350,
		'height': 270
	},{
		'image': 'chapter1/3.jpg',
		'position': '600px -270px',
		'width': 280,
		'height': 270
	},{
		'image': 'chapter1/3.jpg',
		'position': '300px -490px',
		'width': 330,
		'height': 220
	},{
		'image': 'chapter1/3.jpg',
		'position': '300px -650px',
		'width': 270,
		'height': 220
	},{
		'image': 'chapter1/3.jpg',
		'position': '600px -490px',
		'width': 340,
		'height': 450
	},{									//page 4
		'image': 'chapter1/4.jpg',
		'position': '360px -70px',
		'width': 340,
		'height': 220
	},{
		'image': 'chapter1/4.jpg',
		'position': '360px -240px',
		'width': 340,
		'height': 210
	},{
		'image': 'chapter1/4.jpg',
		'position': '580px -70px',
		'width': 270,
		'height': 370
	},{
		'image': 'chapter1/4.jpg',
		'position': '310px -400px',
		'width': 290,
		'height': 190
	},{
		'image': 'chapter1/4.jpg',
		'position': '570px -400px',
		'width': 290,
		'height': 190
	},{
		'image': 'chapter1/4.jpg',
		'position': '170px -550px',
		'width': 150,
		'height': 240
	},{
		'image': 'chapter1/4.jpg',
		'position': '570px -550px',
		'width': 550,
		'height': 390
	},{								//page 5
		'image': 'chapter1/5.jpg',
		'position': '220px 0px',
		'width': 300,
		'height': 300
	},{
		'image': 'chapter1/5.jpg',
		'position': '400px -70px',
		'width': 240,
		'height': 250
	},{
		'image': 'chapter1/5.jpg',
		'position': '580px -70px',
		'width': 240,
		'height': 250
	},{
		'image': 'chapter1/5.jpg',
		'position': '260px -270px',
		'width': 240,
		'height': 200
	},{
		'image': 'chapter1/5.jpg',
		'position': '580px -270px',
		'width': 370,
		'height': 200
	},{
		'image': 'chapter1/5.jpg',
		'position': '330px -430px',
		'width': 310,
		'height': 230
	},{
		'image': 'chapter1/5.jpg',
		'position': '580px -430px',
		'width': 310,
		'height': 230
	},{
		'image': 'chapter1/5.jpg',
		'position': '270px -620px',
		'width': 250,
		'height': 250
	},{
		'image': 'chapter1/5.jpg',
		'position': '570px -600px',
		'width': 350,
		'height': 250
	},{								//page 6
		'image': 'chapter1/6.jpg',
		'position': '200px -70px',
		'width': 180,
		'height': 280
	},{
		'image': 'chapter1/6.jpg',
		'position': '400px -70px',
		'width': 230,
		'height': 250
	},{
		'image': 'chapter1/6.jpg',
		'position': '650px -50px',
		'width': 470,
		'height': 300
	},{
		'image': 'chapter1/6.jpg',
		'position': '240px -300px',
		'width': 110,
		'height': 160
	},{
		'image': 'chapter1/6.jpg',
		'position': '190px -300px',
		'width': 190,
		'height': 220
	},{
		'image': 'chapter1/6.jpg',
		'position': '450px -300px',
		'width': 250,
		'height': 200
	},{
		'image': 'chapter1/6.jpg',
		'position': '590px -300px',
		'width': 130,
		'height': 190
	},{
		'image': 'chapter1/6.jpg',
		'position': '490px -450px',
		'width': 490,
		'height': 240
	},{
		'image': 'chapter1/6.jpg',
		'position': '590px -450px',
		'width': 490,
		'height': 240
	},{
		'image': 'chapter1/6.jpg',
		'position': '590px -650px',
		'width': 570,
		'height': 240
	},{								//page 7
		'image': 'chapter1/7.jpg',
		'position': '590px -50px',
		'width': 570,
		'height': 140
	},{
		'image': 'chapter1/7.jpg',
		'position': '590px -50px',
		'width': 570,
		'height': 270
	},{
		'image': 'chapter1/7.jpg',
		'position': '330px -320px',
		'width': 370,
		'height': 270
	},{
		'image': 'chapter1/7.jpg',
		'position': '330px -320px',
		'width': 370,
		'height': 570
	},{
		'image': 'chapter1/7.jpg',
		'position': '580px -300px',
		'width': 300,
		'height': 270
	},{
		'image': 'chapter1/7.jpg',
		'position': '580px -600px',
		'width': 300,
		'height': 270
	},{							//page 8
		'image': 'chapter1/8.jpg',
		'position': '280px -60px',
		'width': 300,
		'height': 400
	},{
		'image': 'chapter1/8.jpg',
		'position': '580px -60px',
		'width': 300,
		'height': 250
	},{
		'image': 'chapter1/8.jpg',
		'position': '600px -60px',
		'width': 300,
		'height': 250
	},{
		'image': 'chapter1/8.jpg',
		'position': '600px -260px',
		'width': 300,
		'height': 250
	},{
		'image': 'chapter1/8.jpg',
		'position': '310px -460px',
		'width': 300,
		'height': 350
	},{
		'image': 'chapter1/8.jpg',
		'position': '510px -460px',
		'width': 240,
		'height': 210
	},{
		'image': 'chapter1/8.jpg',
		'position': '600px -460px',
		'width': 330,
		'height': 210
	},{
		'image': 'chapter1/8.jpg',
		'position': '600px -640px',
		'width': 330,
		'height': 230
	},{								//page 9
		'image': 'chapter1/9.jpg',
		'position': '340px -80px',
		'width': 330,
		'height': 230
	},{
		'image': 'chapter1/9.jpg',
		'position': '610px -80px',
		'width': 330,
		'height': 230
	},{
		'image': 'chapter1/9.jpg',
		'position': '510px -300px',
		'width': 450,
		'height': 330
	},{
		'image': 'chapter1/9.jpg',
		'position': '610px -290px',
		'width': 600,
		'height': 530
	},{								//page 10
		'image': 'chapter1/10.jpg',
		'position': '660px -50px',
		'width': 650,
		'height': 300
	},{
		'image': 'chapter1/10.jpg',
		'position': '260px -340px',
		'width': 230,
		'height': 230
	},{
		'image': 'chapter1/10.jpg',
		'position': '260px -570px',
		'width': 230,
		'height': 300
	},{
		'image': 'chapter1/10.jpg',
		'position': '580px -330px',
		'width': 360,
		'height': 270
	},{
		'image': 'chapter1/10.jpg',
		'position': '580px -580px',
		'width': 360,
		'height': 270
	},{								//page 11
		'image': 'chapter1/11.jpg',
		'position': '240px -80px',
		'width': 210,
		'height': 260
	},{
		'image': 'chapter1/11.jpg',
		'position': '410px -80px',
		'width': 210,
		'height': 260
	},{
		'image': 'chapter1/11.jpg',
		'position': '580px -80px',
		'width': 210,
		'height': 260
	},{
		'image': 'chapter1/11.jpg',
		'position': '240px -320px',
		'width': 210,
		'height': 260
	},{
		'image': 'chapter1/11.jpg',
		'position': '410px -320px',
		'width': 210,
		'height': 260
	},{
		'image': 'chapter1/11.jpg',
		'position': '580px -320px',
		'width': 210,
		'height': 260
	},{
		'image': 'chapter1/11.jpg',
		'position': '240px -560px',
		'width': 210,
		'height': 280
	},{
		'image': 'chapter1/11.jpg',
		'position': '570px -560px',
		'width': 367,
		'height': 280
	},{								//end
		'words': 'the game is coming soon',
		'portrait': 'ming.png',
		'right': 400
	}],
	'win': [{
		'portrait': 'cross.png',
		'position': '.right',
		'words': 'aoaoaoaoaoaoao！'
	},{
		'portrait': 'ochi.png',
		'position': '.left',
		'words': '混蛋！居然敢偷袭我！<div class="start" onclick="menu();">next</div>'
	}],
	'lost': [{
		'portrait': 'cross.png',
		'position': '.right',
		'words': 'oaoaoaoaoaoaoao5↓oaoaoaoaoaoaoao！<div class="start" onclick="menu();">restart</div>'
	}]
};

/*********map init*********/
$("#stage").css({
	'background':'#fff',
	'background-position': '0px 0px',
	'background-repeat': 'no-repeat'
});
var map = {
	'width':1900,
	'height':1000
}

var charInit = function() {
	// ochi.mode="stiff";		//init the characters
}

$.when(
$.ajax({
	url: "js/characters/ming.js",
	async: false,
	dataType: "script"
}),
$.ajax({
	url: "js/characters/ochi.js",
	async: false,
	dataType: "script"
}),
$.ajax({
	url: "js/characters/cos.js",
	async: false,
	dataType: "script"
})).done(function() {
	charInit();
});

function op(){
	object.push(ochi);
	object.push(Ming);
	for (var i = 0; i < len; i++) {
	    object.push(node[i]);
	}

	start();	
}

handleCollisions = function() {

	if (collides(Ming.attackArea, ochi)) {
		Ming.grinji();
	}

	if (collides(node[weak], ochi)) {
		if (ochi.mode == "atk") {
			node[0].hit();
		}
	}

	if (collides(node[0], ochi)) {
		if (!ochi.buff.in_array("invincible")) {
			Sound.play("beaten");
			node[0].angry -= 1;
			ochi.hurt(.5);
			//ochi.hurt(node[0].x,node[0].y);
		}
	}

}