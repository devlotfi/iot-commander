import { type Schema, Type, type FunctionDeclaration } from "@google/genai";

// ----------------------------
// Helpers
// ----------------------------

import type { Value } from "./types/handler-call";
import type { DeviceSchema } from "./types/device";

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function mapValueToSchema(value: Value): Schema {
  const schema: Schema = {};

  switch (value.type) {
    case "INT":
    case "RANGE":
      schema.type = Type.INTEGER;
      if (value.type === "RANGE") {
        if (value.min !== undefined) schema.minimum = value.min;
        if (value.max !== undefined) schema.maximum = value.max;
      }
      break;

    case "FLOAT":
    case "DOUBLE":
      schema.type = Type.NUMBER;
      break;

    case "BOOL":
      schema.type = Type.BOOLEAN;
      break;

    case "STRING":
      schema.type = Type.STRING;
      break;

    case "ENUM":
      schema.type = Type.STRING;
      if (value.enumDefinition) {
        schema.enum = value.enumDefinition;
      }
      break;

    case "COLOR":
      schema.type = Type.STRING;
      schema.pattern = "^#[0-9A-Fa-f]{6}$";
      schema.description = "Hex color like #RRGGBB";
      break;

    default:
      schema.type = Type.STRING;
  }

  return schema;
}

// ----------------------------
// Main Transformer
// ----------------------------

export function deviceSchemasToGeminiFunctions(
  devices: DeviceSchema[],
): FunctionDeclaration[] {
  const functions: FunctionDeclaration[] = [];

  for (const device of devices) {
    const deviceIdEnum = [device.id];

    // -------- Queries --------
    for (const query of device.queries || []) {
      const fnName = normalizeName(`get_${query.name}`);

      const parameters: Schema = {
        type: Type.OBJECT,
        properties: {
          deviceId: {
            type: Type.STRING,
            enum: deviceIdEnum,
          },
        },
        required: ["deviceId"],
      };

      functions.push({
        name: fnName,
        description: `Query "${query.name}" from device ${device.name ?? device.id}`,
        parameters,
      });
    }

    // -------- Actions --------
    for (const action of device.actions || []) {
      const fnName = normalizeName(action.name);

      const properties: Record<string, Schema> = {
        deviceId: {
          type: Type.STRING,
          enum: deviceIdEnum,
        },
      };

      const required: string[] = ["deviceId"];

      for (const param of action.parameters || []) {
        const key = normalizeName(param.name);

        properties[key] = mapValueToSchema(param);

        if (param.required) {
          required.push(key);
        }
      }

      const parameters: Schema = {
        type: Type.OBJECT,
        properties,
        required,
      };

      functions.push({
        name: fnName,
        description: `Execute "${action.name}" on device ${device.name ?? device.id}`,
        parameters,
      });
    }
  }

  return functions;
}
