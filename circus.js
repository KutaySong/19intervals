
const r = 100
const nota = {}
let dize = []
const audioCtx = new AudioContext();

function setup() {    //katmanları olustur
	frameRate(5)
	createCanvas(innerWidth-30, innerHeight-40);
	colorMode(HSB);
	textAlign(CENTER,CENTER);
	textSize(.6*r);
	strokeWeight(5)
	notalarıYarat ()

}

function notalarıYarat () {
	const rad = Math.min(innerWidth,innerHeight)/5
	const merkez = [innerWidth/3, innerHeight/2]
	let açı = 0
	const arr = ['A','C','E','G','B','D','F']
	for (const n of arr) {
		nota[n] = {x:merkez[0]+rad*Math.sin(açı),y:merkez[1]-rad*Math.cos(açı)}
		açı += 2*PI / arr.length
	}
}

function draw() {     
	fareKontrol()
	if (fare.çal) çal()
	background('lightblue');
	for (const n in nota) {
		ellipse(nota[n].x,nota[n].y-r/15,r,r)
		text(n,nota[n].x,nota[n].y)
	}
}

let fare = {çal:false, nota:'.'}
function fareKontrol () {
	for (const n in nota) {
		if ((mouseX-nota[n].x)**2+(mouseY-nota[n].y)**2<(r/2)**2) {
			if (fare.nota!=n) fare.çal = true
			fare.nota = n
			return
		}
	}
	fare.nota = '.'
}


function çal () {
	fare.çal = false
	
	let freq =
	fare.nota=='D' ? 176 :
	fare.nota=='E' ? 186 :
	fare.nota=='F' ? 176 :
	fare.nota=='G' ? 196 :
	fare.nota=='A' ? 220 :
	fare.nota=='B' ? 186 :
	fare.nota=='C' ? 250 : 400
	
        
	const osc = audioCtx.createOscillator()
	osc.type = 'sawtooth'
	osc.frequency.value = freq
	
	const gain = audioCtx.createGain()
	gain.gain.value = 0.2
	
	osc.connect(gain)
	gain.connect(audioCtx.destination)
	
	osc.start()
	
	setTimeout(function() {
		osc.stop()
	}, 250)
}

function mouseWheel(event) {
	if (event.delta > 0) 
	null
}

function windowResized() {
	resizeCanvas(innerWidth - 20, innerHeight - 20)
}
