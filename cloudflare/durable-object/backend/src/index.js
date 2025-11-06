import { DurableObject } from "cloudflare:workers";


export class Veet extends DurableObject {
	
	constructor(ctx, env) {
		super(ctx, env);
		this.sessions = new Map();
		this.ctx.getWebSockets().forEach((ws) => {
			this.sessions.set(ws, { ...ws.deserializeAttachment() });
		});
	}

	
		async fetch(_req) {
		const pair = new WebSocketPair();
		this.ctx.acceptWebSocket(pair[1]);
		this.sessions.set(pair[1], {});
		return new Response(null, { status: 101, webSocket: pair[0] });
	}
}

export default {
	
	async fetch(request, env, _ctx) {
			const upgrade = request.headers.get('Upgrade');
		if (!upgrade || upgrade != 'websocket') {
			return new Response('Expected upgrade to websocket', { status: 426 });
		}

		const id = env.VEET.idFromName(new URL(request.url).pathname);

		const veet = env.VEET.get(id);

		return veet.fetch(request);
	},
};
