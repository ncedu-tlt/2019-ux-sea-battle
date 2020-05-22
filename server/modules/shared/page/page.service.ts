import { Options } from "./options";
import { Page } from "./page";
import { Response } from "express";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PageService {
    getOptions(range: string): Options {
        const ranges = range.split("-", 2);
        const begin = parseInt(ranges[0]);
        const end = parseInt(ranges[1]);

        return {
            begin,
            end,
            limit: {
                take: end - begin,
                skip: begin > 0 ? begin - 1 : begin
            }
        };
    }

    async getItems<T>(
        options: Options,
        find: (Object) => Promise<T[]>
    ): Promise<Page<T>> {
        const page = new Page<T>();
        page.begin = options.begin;
        page.end = options.end;

        page.items = await find(options.limit);
        return page;
    }

    sendResponse<T>(res: Response, header: string, items: T[]): Response {
        res.set("Range", header);
        return res.send(items);
    }
}
