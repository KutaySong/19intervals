
const r = 50
let clicked = false

function setup() {    //katmanları olustur
	frameRate(4)
	createCanvas(innerWidth-30, innerHeight-40);
	colorMode(HSB);
	textAlign(CENTER,CENTER);
	textSize(.6*r);
	strokeWeight(3)
	dize12seçki()
	dize19seçki()
	panelkur()
	
}


let dize12 = []
function dize12seçki () {
	const beyazlar = dize12.length ? 
	dize12.filter(d => d.tık).map(d => dize12.indexOf(d))
	: [0,2,4,5,7,9,11]
	const divx = (innerWidth-200)/36
	dize12 = []
	for (let i=0; i < 37; i++) {
		dize12.push({çiz:[i*divx+40,20,divx,r],tık:false,f:2**(i/12)*440,tip:12})
	}
	dize12.forEach((d,i) => d.tık = beyazlar.includes(i%12))
}
let dize19 = []
function dize19seçki () {
	const beyazlar = dize19.length ? 
	dize19.filter(d => d.tık).map(d => dize19.indexOf(d))
	: [2,4,6,9,11,13,14,16,18]
	const divx = (innerWidth-200)/38
	dize19 = []
	for (let i=0; i < 39; i++) {
		dize19.push({çiz:[i*divx+40,50+8*r,divx,r],tık:false,f:3**(i/19)*440,tip:19})
	}
	dize19.forEach((d,i) => d.tık = beyazlar.includes(i%19))
}

let panel = []
function panelkur () {
	panel = structuredClone(dize12.filter(d => d.tık))
	panel.forEach((o,i) => {
		o.çiz[1] += o.çiz[3]+r*5
		o.çiz[3] *= 2
		if (panel[i+1]) o.çiz[2] = panel[i+1].çiz[0] - o.çiz[0]
	})	
	const harmonik1 = structuredClone(panel.filter((_,i) => i%2))
	harmonik1.forEach((o,i) => {
		o.çiz[1] += r*-2
		o.çiz[3] *= .5
		if (harmonik1[i+1]) o.çiz[2] = harmonik1[i+1].çiz[0] - o.çiz[0]
	})	
	const harmonik2 = structuredClone(panel.filter((_,i) => !(i%2)))
	harmonik2.forEach((o,i) => {
		o.çiz[1] += r*-4
		o.çiz[3] *= .5
		if (harmonik1[i+1]) o.çiz[2] = harmonik1[i+1].çiz[0] - o.çiz[0]
	})	
	panel = panel.concat(harmonik1).concat(harmonik2)
	
	panel19 = structuredClone(dize19.filter(d => d.tık))
	panel19.forEach((o,i) => {
		o.çiz[1] += o.çiz[3]+r*1
		o.çiz[3] *= 2
		if (panel19[i+1]) o.çiz[2] = panel19[i+1].çiz[0] - o.çiz[0]
	})	
	const harmondokuz1 = structuredClone(panel19.filter((_,i) => i%2))
	harmondokuz1.forEach((o,i) => {
		o.çiz[1] += r*3
		o.çiz[3] *= .5
		if (harmondokuz1[i+1]) o.çiz[2] = harmondokuz1[i+1].çiz[0] - o.çiz[0]
	})	
	const harmondokuz2 = structuredClone(panel19.filter((_,i) => !(i%2)))
	harmondokuz2.forEach((o,i) => {
		o.çiz[1] += r*5
		o.çiz[3] *= .5
		if (harmondokuz2[i+1]) o.çiz[2] = harmondokuz2[i+1].çiz[0] - o.çiz[0]
	})	
	panel = panel.concat(panel19).concat(harmondokuz1).concat(harmondokuz2)
}


let freq = 0
function draw() {     
	hover()
	çal()
	
	// çizim:
	background(0)
	for (const kare of dize12) {
		fill(kare.tık? 'darkorange' : 'purple')
		rect(...kare.çiz)
	}
	for (const kare of dize19) {
		fill(kare.tık? 'darkorange' : 'purple')
		rect(...kare.çiz)
	}
	for (const kare of panel) {
		fill(abs(kare.f-freq)<freq/20 ? 'cyan' : kare.tip==12 ? 'lightblue' :  [155, 70, 80])
		hover(kare.çiz) ? çal() : null
		rect(...kare.çiz)
	}
}


function hover () {
	const x = mouseX
	const y = mouseY
	
	const pp = panel.findLast(p => x > p.çiz[0] && x < p.çiz[0]+p.çiz[2] && y > p.çiz[1] && y < p.çiz[1]+p.çiz[3])
	freq = pp ? pp.f : 0
}
function mouseClicked() {
	clicked = true
	let ID = dize12.findIndex(o => mouseX > o.çiz[0] && mouseX < o.çiz[0] + o.çiz[2] && mouseY > o.çiz[1] && mouseY < o.çiz[1] + o.çiz[3])
	if (ID>-1) dize12.forEach((d,i)=> d.tık = i%12==ID%12 ? !d.tık : d.tık  )
	ID = dize19.findIndex(o => mouseX > o.çiz[0] && mouseX < o.çiz[0] + o.çiz[2] && mouseY > o.çiz[1] && mouseY < o.çiz[1] + o.çiz[3])
	if (ID>-1) dize19.forEach((d,i)=> d.tık = i%19==ID%19 ? !d.tık : d.tık  )
	panelkur()
}

function çal() {
	if(!clicked) return
	let sound = new Sound(context);
	sound.play(freq);
	sound.stop();
}







class Sound {
	
	constructor(context) {
		this.context = context;
	}
	
	setup() {
		this.oscillator = this.context.createOscillator();
		this.gainNode = this.context.createGain();
		
		this.oscillator.connect(this.gainNode);
		this.gainNode.connect(this.context.destination);
		this.oscillator.type = 'sine';
	}
	
	play(value) {
		this.setup();
		
		this.oscillator.frequency.value = value;
		this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
		this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);
		
		this.oscillator.start(this.context.currentTime);
		this.stop(this.context.currentTime);
	}
	
	stop() {
		this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);
		this.oscillator.stop(this.context.currentTime + 1);
	}
}
let context = new (window.AudioContext || window.webkitAudioContext)();


function windowResized() {
	resizeCanvas(innerWidth - 20, innerHeight - 20)
	dize12seçki()
	dize19seçki()
	panelkur()
}
