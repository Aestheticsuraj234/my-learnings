const myVid = document.getElementById('my-video');
const peerVid = document.getElementById('peer-video');
const videoBtn = document.getElementById('video-ctl');
const endCallBtn = document.getElementById('endcall');
const audioBtn = document.getElementById('audio-ctl');
const localVid = document.getElementById('local-video');
const remoteVid = document.getElementById('remote-video');
const env = {};

if (location.hostname == 'localhost') {
	env.ws = 'ws://localhost:8787';
	env.servers = { iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }] };
} else {
	//TODO
}

let ws;
let localStream;
let remoteStream;
let peerConnection;


async function handleMessages(e) {
	const msg = JSON.parse(e.data);
	
	console.log(msg);
}

const wssend = (data) => ws.send(JSON.stringify(data));
(async function () {
	const id = new URLSearchParams(location.search).get('i');
	if (!id) return;
	ws = new WebSocket(`${env.ws}/${id}`);
	ws.onmessage = handleMessages;
	ws.onopen = () => wssend({ type: 'joined' });
	await startLocalPlayback();

})();

async function startLocalPlayback() {
	const config = { video: { width: { min: 1280, ideal: 1920 }, height: { min: 720, ideal: 1080 } }, audio: true };
	localStream = await navigator.mediaDevices.getUserMedia(config);
	myVid.srcObject = localStream;
}
