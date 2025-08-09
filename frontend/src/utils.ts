export function getGatewayUrl(): string {
  const gatewayUrl = process.env["GATEWAY_URL"];
  if (!gatewayUrl) throw Error("No GATEWAY_URL env");
	return gatewayUrl;
}

