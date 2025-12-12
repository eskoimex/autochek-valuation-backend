import { Module } from "@nestjs/common";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";
import { LoansModule } from "../loans/loans.module";

@Module({
  imports: [LoansModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
