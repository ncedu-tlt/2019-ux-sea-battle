import { PageService } from "./page/page.service";
import { Module } from "@nestjs/common";

@Module({
    providers: [PageService],
    exports: [PageService]
})
export class SharedModule {}
