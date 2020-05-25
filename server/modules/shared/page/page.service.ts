import { Range } from "./range";
import { Page } from "./page";
import { Response } from "express";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PageService {
    parseRange(range: string): Range {
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
        range: string,
        find: (Object) => Promise<T[]>
    ): Promise<Page<T>> {
        const rangeObject = this.parseRange(range);

        const page = new Page<T>();
        page.begin = rangeObject.begin;
        page.end = rangeObject.end;

        page.items = await find(rangeObject.limit);
        return page;
    }

    sendResponse<T>(res: Response, page: Page<T>): Response {
        res.set("Range", page.getHeader());
        return res.send(page.items);
    }
}
