import { Module } from "@nestjs/common";
import { LoansController } from "./loans.controller";
import { LoansService } from "./loans.service";
import { VehiclesModule } from "../vehicles/vehicles.module";
import { ValuationsModule } from "../valuations/valuations.module";

@Module({
  imports: [VehiclesModule, ValuationsModule],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
