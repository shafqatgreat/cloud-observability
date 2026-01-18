/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

                                  
const AUTH_SERVICE_URL = "https://auth-service-cm.up.railway.app"; // replace with your Railway Auth URL
const ORDER_SERVICE_URL = "https://order-service-your-url.up.railway.app"; // optional, later

// CORS helper
const corsHeaders = (origin = "*") => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,x-trace-id",
});

// Helper for JSON error responses
const error = (message, status = 500, origin = "*") =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: corsHeaders(origin),
  });

// Helper for success responses
const success = (data, origin = "*") =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders(origin),
  });

// Forward request to a service with trace headers
async function forwardRequest(url, request) {
  // Extract trace headers from incoming request
  const traceHeaders = {};
  if (request.headers.get("traceparent")) {  
	traceHeaders["traceparent"] = request.headers.get("traceparent");
	const tracestate = request.headers.get("tracestate");
	if (tracestate) traceHeaders["tracestate"] = tracestate;
  }
  // Forward request
  const resp = await fetch(url,{
	method: request.method,
	headers: {
      "Content-Type": "application/json",
      ...traceHeaders,
    },
	body: request.body ? request.body : null,
  });

  const data = await resp.json();
  return data;
}


export default {
	async fetch(request, env) {
	try {
		const origin = request.headers.get("Origin") || "*";
		// 1️⃣ Handle CORS preflight
		if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
      	}

		// 2️⃣ Forward login request to Auth Service
		if (request.url.endsWith("/login") && request.method === "POST") {
			const authResponse = await forwardRequest(AUTH_SERVICE_URL + "/login", request);
			return success(authResponse, origin);
		}
		return error("Not Found", 404, origin);
      
    } catch (err) {
		return error(err.message, 500);      
    }
	},
};
