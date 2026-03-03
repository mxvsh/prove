import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { IdeaInputSchema } from "@prove.ink/core";
import type { AppDeps } from "../app.js";
import { ProjectService } from "../services/project-service.js";
import { ChatService } from "../services/chat-service.js";
import { SSEManager } from "../services/sse-manager.js";

export function createProjectRoutes(deps: AppDeps) {
  const routes = new Hono();
  const projectService = new ProjectService(deps.storage, deps.logger);
  const chatService = new ChatService(deps.engine, deps.eventBus, deps.logger);
  const sseManager = new SSEManager(deps.eventBus);

  // Create project
  routes.post("/", zValidator("json", IdeaInputSchema), async (c) => {
    const { idea } = c.req.valid("json");
    const project = await projectService.create(idea);

    chatService.startProject(project.id, idea).catch((err) => {
      deps.logger.error({ projectId: project.id, err }, "Workflow start failed");
    });

    return c.json(project, 201);
  });

  // List projects
  routes.get("/", async (c) => {
    const projects = await projectService.list();
    return c.json({ projects });
  });

  // Get project
  routes.get("/:id", async (c) => {
    const project = await projectService.get(c.req.param("id"));
    return c.json(project);
  });

  // Delete project
  routes.delete("/:id", async (c) => {
    await projectService.delete(c.req.param("id"));
    return c.json({ success: true });
  });

  // Chat - send message
  routes.post(
    "/:id/chat",
    zValidator("json", z.object({ message: z.string().min(1) })),
    async (c) => {
      const { message } = c.req.valid("json");
      const projectId = c.req.param("id");
      const result = await chatService.resumeChat(projectId, message);
      return c.json(result);
    }
  );

  // Append persisted message
  routes.post(
    "/:id/messages",
    zValidator(
      "json",
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
        timestamp: z.string().min(1),
      })
    ),
    async (c) => {
      const projectId = c.req.param("id");
      const message = c.req.valid("json");
      await projectService.appendMessage(projectId, message);
      return c.json({ success: true });
    }
  );

  // SSE stream
  routes.get("/:id/stream", async (c) => {
    const projectId = c.req.param("id");

    return streamSSE(c, async (stream) => {
      let closed = false;

      const writer = {
        writeSSE: async (data: {
          event: string;
          data: string;
          id?: string;
        }) => {
          if (closed) return;
          await stream.writeSSE(data);
        },
      };

      sseManager.subscribe(projectId, writer);

      await stream.writeSSE({
        event: "connected",
        data: JSON.stringify({ projectId }),
        id: "0",
      });

      stream.onAbort(() => {
        closed = true;
        sseManager.unsubscribe(projectId, writer);
      });

      while (!closed) {
        try {
          await stream.writeSSE({
            event: "heartbeat",
            data: JSON.stringify({ timestamp: Date.now() }),
          });
          await stream.sleep(30000);
        } catch {
          closed = true;
          sseManager.unsubscribe(projectId, writer);
          break;
        }
      }
    });
  });

  // Trigger research
  routes.post(
    "/:id/research",
    zValidator(
      "json",
      z.object({ queries: z.array(z.string()).optional() }).optional()
    ),
    async (c) => {
      const projectId = c.req.param("id");
      const body = c.req.valid("json");
      const result = await chatService.triggerResearch(projectId, body?.queries);
      return c.json(result);
    }
  );

  return routes;
}
