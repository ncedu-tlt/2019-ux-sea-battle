import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDAO } from "./domain/user.dao";

@Module({
    imports: [TypeOrmModule.forFeature([UserDAO])],
    exports: [TypeOrmModule]
})
export class DbModule {}
