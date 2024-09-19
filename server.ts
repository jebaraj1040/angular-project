import "zone.js/node";

import { APP_BASE_HREF } from "@angular/common";
import { CommonEngine } from "@angular/ssr";
import express from "express";
import bootstrap from "./src/main.server";
import { environment } from "src/environments/environment";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import compression from "compression";
import morgan from "morgan";

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, "../browser");
    const indexHtml = join(serverDistFolder, "index.server.html");
    require("dotenv").config({
        path: `./src/environments/server/.env.${environment.env}`,
    });
    const commonEngine = new CommonEngine();

    // Http Request Logger
    if (environment.env == "dev") {
        server.use(morgan("dev"));
    }

    // Compress all HTTP responses
    server.use(compression({ level: 6 }));

    server.set("view engine", "html");
    server.set("views", browserDistFolder);

    // Avoid too many files open issue
    server.enable("view cache");

    // Serve static files from /browser
    server.get(
        "*.*",
        express.static(browserDistFolder, {
            maxAge: "1y",
        })
    );

    // All regular routes use the Angular engine
    server.get("*", (req, res, next) => {
        const { protocol, originalUrl, baseUrl, headers } = req;
        commonEngine
            .render({
                bootstrap,
                documentFilePath: indexHtml,
                url: `${protocol}://${headers.host}${originalUrl}`,
                publicPath: browserDistFolder,
                providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
            })
            .then((html) => res.send(html))
            .catch((err) => next(err));
    });

    return server;
}

function run(): void {
    const port = process.env["PORT"] || 4002;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
        console.log(
            `Node Express server listening on http://localhost:${port}`
        );
    });
}

run();
