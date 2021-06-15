import "@mgcrea/fastify-session";

declare module "@mgcrea/fastify-session" {
  interface SessionData {
    user?: {
      id: string;
      first_name: string;
      username: string;
      photo_url: string;
      auth_date: string;
    };
  }
}
