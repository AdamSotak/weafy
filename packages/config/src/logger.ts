import { LogLevel } from "@prisma/client";
import { db } from "./db/db";

class Logger {
    private async log(origin: string, level: LogLevel, message: string) {
        const log = await db.log.create({
            data: {
                origin,
                level,
                message
            }
        });

        console.log(`${log.createdAt.toISOString()} [${log.origin}] ${log.level}: ${log.message}`);
    }

    public async info(origin: string, message: string) {
        await this.log(origin, "INFO", message);
    }

    public async warning(origin: string, message: string, silent: boolean = false) {
        await this.log(origin, "WARNING", message);

        // if (!silent) {
        //     FirebaseMessaging.sendNotification("Warning", message);
        // }
    }

    public async error(origin: string, message: string, silent: boolean = false) {
        await this.log(origin, "ERROR", message);

        // if (!silent) {
        //     FirebaseMessaging.sendNotification("Error", message);
        // }
    }
}

export default new Logger();