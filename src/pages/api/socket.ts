import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(res.socket as { server: { io?: Server } }).server.io) {
    const io = new Server((res.socket as { server: { io?: Server } }).server, {
      path: "/api/socket"
    });

    io.on("connection", (socket) => {
      socket.on("join", (conversationId: string) => {
        socket.join(conversationId);
      });

      socket.on("message", ({ conversationId, message }) => {
        io.to(conversationId).emit("message", message);
      });
    });

    (res.socket as { server: { io?: Server } }).server.io = io;
  }

  res.end();
}
