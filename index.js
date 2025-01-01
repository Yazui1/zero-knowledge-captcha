import indexHtml from "./index.html";
import testHtml from "./test.html";

export default {
	async fetch(request, env) {
		if (request.method !== "POST") {
			const pathname = new URL(request.url).pathname;

			let html;
			switch (pathname) {
				case "/test":
					html = testHtml;
					break;
				default:
					html = indexHtml;
			}

			return new Response(
				html
					.replaceAll("{{PUBLIC_SIGNING_KEY}}", env.PUBLIC_SIGNING_KEY)
					.replaceAll("{{CF_TURNSTILE_SITE_KEY}}", env.CF_TURNSTILE_SITE_KEY)
					.replaceAll("{{ORIGIN}}", new URL(request.url).origin),
				{ headers: { "Content-Type": "text/html" } }
			);
		}

		const body = await request.json();
		const cfTurnstileResponse = body["cf-turnstile-response"];
		const shaNonce = body["shaNonce"];

		let formData = new FormData();
		formData.append("secret", env.CF_TURNSTILE_SECRET_KEY);
		formData.append("response", cfTurnstileResponse);

		const result = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				body: formData,
				method: "POST",
			}
		);

		const outcome = await result.json();
		if (!outcome.success) {
			return new Response(null, { status: 400 });
		}

		const keyData = env.PRIVATE_SIGNING_KEY.replace(/-----.*-----|\n/g, "");
		const keyArrayBuffer = Uint8Array.from(atob(keyData), (c) =>
			c.charCodeAt(0)
		).buffer;

		const key = await crypto.subtle.importKey(
			"pkcs8",
			keyArrayBuffer,
			{ name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
			false,
			["sign"]
		);

		const data = new TextEncoder().encode(shaNonce);

		const signature = new Uint8Array(
			await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, data)
		);

		return new Response(signature, {
			headers: { "Content-Type": "application/octet-stream" },
		});
	},
};
