// export const URL_API = "ws://localhost:8080/ws/";
// export const URL_API = "wss://hashiplayero.pl/ws/";
export const URL_API = `ws${
  document.location.host.startsWith("localhost") ? "" : "s"
}://${document.location.host}/ws/`;
