import axios from "axios";
import { Vehicle } from "../entities/vehicle.entity";

export default class Helper {
  /**
   * Estimate a vehicle’s valuation locally without calling any external API.
   * - Starts from a base price.
   * - Applies age‐based and mileage‐based depreciation.
   * - Ensures the returned value never goes below a minimum (₦500).
   * Used as a fallback when external valuation fails or is unavailable.
   */
  static simulateValuation(vehicle: Vehicle): number {
    const base = 30000;
    const age = Math.max(0, new Date().getFullYear() - vehicle.year);
    const depreciation = Math.min(0.95, 0.12 * age + vehicle.mileage / 200000);
    return Math.max(500, Math.round(base * Math.max(0.1, 1 - depreciation)));
  }

  /**
   * Attempts to call the external VIN valuation API using RapidAPI.
   * - If API credentials are missing, falls back to simulated valuation.
   * - Parses common fields returned by external valuation providers.
   * - If no direct numeric value is found, performs a deep scan to find any number.
   * - On error (network, bad response, timeout), logs the issue and falls back to simulation.
   */
  static async callExternalValuation(
    vin: string,
    vehicle: Vehicle
  ): Promise<number> {
    const key = process.env.RAPIDAPI_KEY;
    const host = process.env.VIN_API_HOST;

    if (!key || !host) return this.simulateValuation(vehicle);

    try {
      const resp = await axios.get(`https://${host}`, {
        params: { vin },
        headers: {
          "X-RapidAPI-Key": key,
          "X-RapidAPI-Host": host,
        },
        timeout: 5000,
      });

      const body = resp.data || {};

      const candidate =
        body.estimatedValue ||
        body.estimated_value ||
        body.value ||
        body.price ||
        (body.vehicle && (body.vehicle.value || body.vehicle.estimatedValue)) ||
        null;

      if (candidate) return Number(candidate);

      const found = this.findFirstNumberInObject(body);
      if (found) return found;

      return this.simulateValuation(vehicle);
    } catch (err) {
      const errorMsg =
        typeof err === "object" && err !== null && "message" in err
          ? err.message
          : err;
      console.warn("external valuation failed", errorMsg);

      return this.simulateValuation(vehicle);
    }
  }

  /**
   * Recursively searches an object (including nested objects and arrays)
   * for the first numeric value it can extract.
   * - Accepts numbers directly.
   * - Converts numeric-looking strings (e.g., "12,000 USD") into numbers.
   * - Helps extract values from messy or unpredictable API responses.
   * Returns the first number found, or null if none exist.
   */
  static findFirstNumberInObject(obj: any): number | null {
    if (!obj || typeof obj !== "object") return null;

    const stack = [obj];

    while (stack.length) {
      const cur = stack.shift();

      if (Array.isArray(cur)) {
        for (const it of cur) stack.push(it);
      } else if (typeof cur === "object") {
        for (const key of Object.keys(cur)) {
          const v = cur[key];
          if (v === null || v === undefined) continue;

          if (typeof v === "number" && !Number.isNaN(v)) return v;

          if (typeof v === "string") {
            const n = Number(v.replace(/[^0-9.-]+/g, ""));
            if (!Number.isNaN(n)) return n;
          }

          if (typeof v === "object") stack.push(v);
        }
      }
    }

    return null;
  }
}