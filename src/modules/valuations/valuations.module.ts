import { Module } from "@nestjs/common";
import { ValuationsController } from "./valuations.controller";
import { ValuationsService } from "./valuations.service";
import { VehiclesModule } from "../vehicles/vehicles.module";

@Module({
  imports: [VehiclesModule],
  controllers: [ValuationsController],
  providers: [ValuationsService],
})
export class ValuationsModule {}
