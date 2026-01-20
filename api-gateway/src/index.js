const AUTH_SERVICE_URL = "https://auth-service-cm.up.railway.app"; // replace with your Railway Auth URL
const ORDER_SERVICE_URL = "https://order-service-cm.up.railway.app"; // optional, later

// CORS helper
const corsHeaders = (origin = "*") => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,x-trace-id",
});

//This function is a standard API response wrapper 
// used in Cloudflare Workers to return 
// JSON + HTTP status + CORS headers cleanly.

const json = (data, status = 200, origin = "*") =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });

// --------------------
// Forward trace headers
// --------------------
function extractTraceHeaders(request) {
  const headers = {};
  const tp = request.headers.get("traceparent");
  const ts = request.headers.get("tracestate");

  if (tp) headers.traceparent = tp;
  if (ts) headers.tracestate = ts;

  return headers;
}

// --------------------
// AUTHORIZATION
// --------------------
async function authorize(request) {
const token = request.headers.get("authorization");
  if (!token) return null;

const resp = await fetch(`${AUTH_SERVICE_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
      ...extractTraceHeaders(request),
    },
  });

  if (!resp.ok) return null;

  const data = await resp.json();
  return data.valid ? data.user : null;
}
// --------------------
// LOGIN FORWARD
// --------------------

async function forwardLogin(request) {
  const resp = await fetch(`${AUTH_SERVICE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...extractTraceHeaders(request),
    },
    body: await request.text(),
  });

  return await resp.json();
}
// --------------------
// ORDER FORWARD
// --------------------
async function forwardOrder(request, user) {
  const resp = await fetch(`${ORDER_SERVICE_URL}/orders`, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",

      // 🔐 identity propagation
      "x-user-id": user.id,
      "x-user-email": user.email,
      "x-user-role": user.role,

      // 🔍 tracing propagation
      ...extractTraceHeaders(request),
    },
    body: await request.text(),
  });

  return await resp.json();
}
// --------------------
// WORKER
// --------------------

export default {
 async fetch(request) {
  const origin = request.headers.get("Origin") || "*";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  try {
    const url = new URL(request.url);
    // 🔑 LOGIN
    if (url.pathname === "/login" && request.method === "POST") {
        const data = await forwardLogin(request);
        return json(data, 200, origin);
    }

    // 📦 ORDER (secured)
    if (url.pathname === "/orders") {
      const user = await authorize(request);
      if (!user) {
          return json({ message: "Unauthorized" }, 401, origin);
      }

      const data = await forwardOrder(request, user);
      return json(data, 200, origin);
    }

  return json({ message: "Not found" }, 404, origin);
  
  }catch (err) {
      return json({ error: err.message }, 500, origin);
  }
  },
};



















// // Helper for JSON error responses
// const error = (message, status = 500, origin = "*") =>
//   new Response(JSON.stringify({ error: message }), {
//     status,
//     headers: corsHeaders(origin),
//   });

// // Helper for success responses
// const success = (data, origin = "*") =>
//   new Response(JSON.stringify(data), {
//     status: 200,
//     headers: corsHeaders(origin),
//   });

// // Forward request to a service with trace headers
// async function forwardRequest(url, request) {
//   // Extract trace headers from incoming request
//   const traceHeaders = {};
//   if (request.headers.get("traceparent")) {  
// 	traceHeaders["traceparent"] = request.headers.get("traceparent");
// 	const tracestate = request.headers.get("tracestate");
// 	if (tracestate) traceHeaders["tracestate"] = tracestate;
//   }
//   // Forward request
//   const resp = await fetch(url,{
// 	method: request.method,
// 	headers: {
//       "Content-Type": "application/json",
//       ...traceHeaders,
//     },
// 	body: request.body ? request.body : null,
//   });

//   const data = await resp.json();
//   return data;
// }


// export default {
// 	async fetch(request, env) {
// 	try {
// 		const origin = request.headers.get("Origin") || "*";
// 		// 1️⃣ Handle CORS preflight
// 		if (request.method === "OPTIONS") {
//         return new Response(null, { status: 204, headers: corsHeaders(origin) });
//       	}

// 		// 2️⃣ Forward login request to Auth Service
// 		if (request.url.endsWith("/login") && request.method === "POST") {
// 			const authResponse = await forwardRequest(AUTH_SERVICE_URL + "/login", request);
// 			return success(authResponse, origin);
// 		}
// 		return error("Not Found", 404, origin);
      
//     } catch (err) {
// 		return error(err.message, 500);      
//     }
// 	},
// };
