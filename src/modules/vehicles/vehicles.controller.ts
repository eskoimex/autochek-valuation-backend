import { Controller, Post, Body, Get, Param, UseGuards } from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from "@nestjs/swagger";
import { UserRole } from "../../utils/enum";

@ApiTags("Vehicles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("vehicles")
export class VehiclesController {
  constructor(private readonly svc: VehiclesService) {}

  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiTags("Vehicles")
  @ApiOperation({
    summary: "Create a new vehicle",
    description: "Creates a new vehicle record in the system.",
  })
  @ApiResponse({ status: 201, description: "Vehicle created successfully." })
  @ApiResponse({ status: 400, description: "Invalid input." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden. Insufficient role." })
  @ApiBody({
    type: CreateVehicleDto,
    description: "Vehicle data to create",
    examples: {
      example: {
        summary: "Sample vehicle",
        value: {
          vin: "1HGCM82633A004352",
          make: "Toyota",
          model: "Corolla",
          year: 2022,
          color: "Blue",
          mileage: 15000,
          price: 12000,
        },
      },
    },
  })
  async create(@Body() dto: CreateVehicleDto) {
    return this.svc.create(dto);
  }

  @Roles(UserRole.AGENT, UserRole.ADMIN, UserRole.LENDER)
  @Get()
  @ApiOperation({
    summary: "List all vehicles",
    description: "Retrieves a list of all vehicles in the system.",
  })
  @ApiResponse({ status: 200, description: "List of vehicles retrieved successfully." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden. Insufficient role." })
  async list() {
    return this.svc.findAll();
  }

  @Roles(UserRole.AGENT, UserRole.ADMIN, UserRole.LENDER)
  @Get(":vin")
  @ApiOperation({
    summary: "Get vehicle by VIN",
    description: "Retrieves a vehicle record by its VIN.",
  })
  @ApiResponse({ status: 200, description: "Vehicle retrieved successfully." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden. Insufficient role." })
  @ApiResponse({ status: 404, description: "Vehicle not found." })
  async get(@Param("vin") vin: string) {
    return this.svc.findByVin(vin);
  }
}
