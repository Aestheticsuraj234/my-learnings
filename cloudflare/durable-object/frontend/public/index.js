const joinForm = document.getElementById('join');
const newFrom = document.getElementById('new');

function startCall(id) {
	window.location.href = `/call?i=${id}`;
}

newFrom.addEventListener('submit', async (e) => {
	e.preventDefault();
	startCall(crypto.randomUUID());
});

joinForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const data = Object.fromEntries(new FormData(e.target));
	const url = new URL(data.url);
	const id = url.searchParams.get('i');
	if (!id) return;
	startCall(id);
});
