#pragma once

#include <etl/optional.h>
#include <etl/variant.h>
#include <etl/vector.h>

#include "Config.h"
#include "Debug.h"
#include "Types.h"
#include "ValueBase.h"

namespace IotCommander::Value
{
  using IntBaseType = int;
  class Int : public ValueBase<IntBaseType>
  {
  public:
    struct Params
    {
      const char* name;
      bool required;
      Validtor<IntBaseType> validator;
    };

    Int(Params params) : ValueBase<IntBaseType>(ValueBase<IntBaseType>::Params{
      .name = params.name,
      .typeName = "INT",
      .required = params.required,
      .validator = params.validator
      }) {
    };

    bool validateParameter(ArduinoJson::JsonObject& jsonValues, HandlerValue& handlerValue) override
    {
      ArduinoJson::JsonVariant valueVariant = jsonValues[name];
      if (valueVariant.isNull() && !required) return true;
      if (valueVariant.isNull() || !valueVariant.is<IntBaseType>()) return false;

      IntBaseType valueData = valueVariant.as<IntBaseType>();
      if (validator && !validator(valueData)) return false;

      handlerValue = valueData;
      return true;
    }
    bool validateResult(HandlerValue& handlerValue, ArduinoJson::JsonObject& jsonValues) override
    {
      if (!handlerValue.has_value() && !required) return true;
      if (!handlerValue.has_value() || !Variant::holds_alternative<IntBaseType>(*handlerValue)) return false;
      IntBaseType valueData = Variant::get<IntBaseType>(*handlerValue);
      if (validator && !validator(valueData)) return false;
      jsonValues[name] = valueData;
      return true;
    }
  };

  using RangeBaseType = int;
  class Range : public ValueBase<RangeBaseType>
  {
  public:
    struct Params
    {
      const char* name;
      bool required;
      Validtor<RangeBaseType> validator;
      int min;
      int max;
    };

    int min;
    int max;

    Range(Params params) : ValueBase<RangeBaseType>(ValueBase<RangeBaseType>::Params{
        .name = params.name,
        .typeName = "RANGE",
        .required = params.required,
        .validator = params.validator
      }),
      min(params.min),
      max(params.max)
    {
    };

    void serialize(ArduinoJson::JsonObject& obj) override
    {
      ValueBase<RangeBaseType>::serialize(obj);
      obj["min"] = min;
      obj["max"] = max;
    }

    bool validateParameter(ArduinoJson::JsonObject& jsonValues, HandlerValue& handlerValue) override
    {
      ArduinoJson::JsonVariant valueVariant = jsonValues[name];
      if (valueVariant.isNull() && !required) return true;
      if (valueVariant.isNull() || !valueVariant.is<RangeBaseType>()) return false;

      RangeBaseType valueData = valueVariant.as<RangeBaseType>();
      if (valueData < min || valueData > max) return false;
      if (validator && !validator(valueData)) return false;

      handlerValue = valueData;
      return true;
    }

    bool validateResult(HandlerValue& handlerValue, ArduinoJson::JsonObject& jsonValues) override
    {
      if (!handlerValue.has_value() && !required) return true;
      if (!handlerValue.has_value() || !Variant::holds_alternative<RangeBaseType>(*handlerValue)) return false;

      RangeBaseType valueData = Variant::get<RangeBaseType>(*handlerValue);
      if (valueData < min || valueData > max) return false;
      if (validator && !validator(valueData)) return false;

      jsonValues[name] = valueData;
      return true;
    }
  };

  using FloatBaseType = float;
  class Float : public ValueBase<FloatBaseType>
  {
  public:
    struct Params
    {
      const char* name;
      bool required;
      Validtor<FloatBaseType> validator;
    };

    Float(Params params) : ValueBase<FloatBaseType>(ValueBase<FloatBaseType>::Params{
      .name = params.name,
      .typeName = "FLOAT",
      .required = params.required,
      .validator = params.validator
      }) {
    };

    bool validateParameter(ArduinoJson::JsonObject& jsonValues, HandlerValue& handlerValue) override
    {
      ArduinoJson::JsonVariant valueVariant = jsonValues[name];
      if (valueVariant.isNull() && !required) return true;
      if (valueVariant.isNull() || !valueVariant.is<FloatBaseType>()) return false;

      FloatBaseType valueData = valueVariant.as<FloatBaseType>();
      if (validator && !validator(valueData)) return false;

      handlerValue = valueData;
      return true;
    }

    bool validateResult(HandlerValue& handlerValue, ArduinoJson::JsonObject& jsonValues) override
    {
      if (!handlerValue.has_value() && !required) return true;
      if (!handlerValue.has_value() || !Variant::holds_alternative<FloatBaseType>(*handlerValue)) return false;

      FloatBaseType valueData = Variant::get<FloatBaseType>(*handlerValue);
      if (validator && !validator(valueData)) return false;

      jsonValues[name] = valueData;
      return true;
    }
  };

  using DoubleBaseType = double;
  class Double : public ValueBase<DoubleBaseType>
  {
  public:
    struct Params
    {
      const char* name;
      bool required;
      Validtor<DoubleBaseType> validator;
    };

    Double(Params params) : ValueBase<DoubleBaseType>(ValueBase<DoubleBaseType>::Params{
      .name = params.name,
      .typeName = "DOUBLE",
      .required = params.required,
      .validator = params.validator
      }) {
    };

    bool validateParameter(ArduinoJson::JsonObject& jsonValues, HandlerValue& handlerValue) override
    {
      ArduinoJson::JsonVariant valueVariant = jsonValues[name];
      if (valueVariant.isNull() && !required) return true;
      if (valueVariant.isNull() || !valueVariant.is<DoubleBaseType>()) return false;

      DoubleBaseType valueData = valueVariant.as<DoubleBaseType>();
      if (validator && !validator(valueData)) return false;

      handlerValue = valueData;
      return true;
    }

    bool validateResult(HandlerValue& handlerValue, ArduinoJson::JsonObject& jsonValues) override
    {
      if (!handlerValue.has_value() && !required) return true;
      if (!handlerValue.has_value() || !Variant::holds_alternative<DoubleBaseType>(*handlerValue)) return false;

      DoubleBaseType valueData = Variant::get<DoubleBaseType>(*handlerValue);
      if (validator && !validator(valueData)) return false;

      jsonValues[name] = valueData;
      return true;
    }
  };

  using BoolBaseType = bool;
  class Bool : public ValueBase<BoolBaseType>
  {
  public:
    struct Params
    {
      const char* name;
      bool required;
      Validtor<BoolBaseType> validator;
    };

    Bool(Params params) : ValueBase<BoolBaseType>(ValueBase<BoolBaseType>::Params{
      .name = params.name,
      .typeName = "BOOL",
      .required = params.required,
      .validator = params.validator
      }) {
    };

    bool validateParameter(ArduinoJson::JsonObject& jsonValues, HandlerValue& handlerValue) override
    {
      ArduinoJson::JsonVariant valueVariant = jsonValues[name];
      if (valueVariant.isNull() && !required) return true;
      if (valueVariant.isNull() || !valueVariant.is<BoolBaseType>()) return false;

      BoolBaseType valueData = valueVariant.as<BoolBaseType>();
      if (validator && !validator(valueData)) return false;

      handlerValue = valueData;
      return true;
    }

    bool validateResult(HandlerValue& handlerValue, ArduinoJson::JsonObject& jsonValues) override
    {
      if (!handlerValue.has_value() && !required) return true;
      if (!handlerValue.has_value() || !Variant::holds_alternative<BoolBaseType>(*handlerValue)) return false;

      BoolBaseType valueData = Variant::get<BoolBaseType>(*handlerValue);
      if (validator && !validator(valueData)) return false;

      jsonValues[name] = valueData;
      return true;
    }
  };

  using StringBaseType = const char*;
  class String : public ValueBase<StringBaseType>
  {
  public:
    struct Params
    {
      const char* name;
      bool required;
      Validtor<StringBaseType> validator;
    };

    String(Params params) : ValueBase<StringBaseType>(ValueBase<StringBaseType>::Params{
      .name = params.name,
      .typeName = "STRING",
      .required = params.required,
      .validator = params.validator
      }) {
    };

    bool validateParameter(ArduinoJson::JsonObject& jsonValues, HandlerValue& handlerValue) override
    {
      ArduinoJson::JsonVariant valueVariant = jsonValues[name];
      if (valueVariant.isNull() && !required) return true;
      if (valueVariant.isNull() || !valueVariant.is<StringBaseType>()) return false;

      StringBaseType valueData = valueVariant.as<StringBaseType>();
      if (validator && !validator(valueData)) return false;

      handlerValue = valueData;
      return true;
    }

    bool validateResult(HandlerValue& handlerValue, ArduinoJson::JsonObject& jsonValues) override
    {
      if (!handlerValue.has_value() && !required) return true;
      if (!handlerValue.has_value() || !Variant::holds_alternative<StringBaseType>(*handlerValue)) return false;

      StringBaseType valueData = Variant::get<StringBaseType>(*handlerValue);
      if (validator && !validator(valueData)) return false;

      jsonValues[name] = valueData;
      return true;
    }
  };

  using EnumBaseType = const char*;
  class Enum : public ValueBase<EnumBaseType>
  {
  public:
    struct Params
    {
      const char* name;
      bool required;
      Validtor<EnumBaseType> validator;
      etl::vector<const char*, IOTC_MAX_ENUM_SIZE> enumDefinition;
    };

    etl::vector<const char*, IOTC_MAX_ENUM_SIZE> enumDefinition;

    Enum(Params params) : ValueBase<EnumBaseType>(ValueBase<EnumBaseType>::Params{
        .name = params.name,
        .typeName = "ENUM",
        .required = params.required,
        .validator = params.validator
      }),
      enumDefinition(params.enumDefinition)
    {
    };

    void serialize(ArduinoJson::JsonObject& obj) override
    {
      ValueBase<EnumBaseType>::serialize(obj);
      auto arr = obj["enumDefinition"].to<ArduinoJson::JsonArray>();
      for (auto& item : enumDefinition)
      {
        arr.add(item);
      }
    }

    bool validateParameter(ArduinoJson::JsonObject& jsonValues, HandlerValue& handlerValue) override
    {
      ArduinoJson::JsonVariant valueVariant = jsonValues[name];
      if (valueVariant.isNull() && !required) return true;
      if (valueVariant.isNull() || !valueVariant.is<EnumBaseType>()) return false;

      EnumBaseType valueData = valueVariant.as<EnumBaseType>();

      bool found = false;
      for (auto& item : enumDefinition)
      {
        if (strcmp(item, valueData) == 0)
        {
          found = true;
          break;
        }
      }
      if (!found) return false;

      if (validator && !validator(valueData)) return false;

      handlerValue = valueData;
      return true;
    }

    bool validateResult(HandlerValue& handlerValue, ArduinoJson::JsonObject& jsonValues) override
    {
      if (!handlerValue.has_value() && !required) return true;
      if (!handlerValue.has_value() || !Variant::holds_alternative<EnumBaseType>(*handlerValue)) return false;

      EnumBaseType valueData = Variant::get<EnumBaseType>(*handlerValue);

      bool found = false;
      for (auto& item : enumDefinition)
      {
        if (strcmp(item, valueData) == 0)
        {
          found = true;
          break;
        }
      }
      if (!found) return false;

      if (validator && !validator(valueData)) return false;

      jsonValues[name] = valueData;
      return true;
    }
  };

  using ColorBaseType = const char*;
  class Color : public ValueBase<ColorBaseType>
  {
  public:
    struct Params
    {
      const char* name;
      bool required;
      Validtor<ColorBaseType> validator;
    };

    Color(Params params) : ValueBase<ColorBaseType>(ValueBase<ColorBaseType>::Params{
      .name = params.name,
      .typeName = "COLOR",
      .required = params.required,
      .validator = params.validator
      }) {
    };

    bool isValidHexColor(const char* str)
    {
      if (!str) return false;

      // Must be exactly 7 characters: #RRGGBB
      if (strlen(str) != 7) return false;

      if (str[0] != '#') return false;

      for (int i = 1; i < 7; ++i)
      {
        char c = str[i];
        bool isDigit = (c >= '0' && c <= '9');
        bool isUpper = (c >= 'A' && c <= 'F');
        bool isLower = (c >= 'a' && c <= 'f');

        if (!(isDigit || isUpper || isLower))
          return false;
      }

      return true;
    }

    bool validateParameter(ArduinoJson::JsonObject& jsonValues, HandlerValue& handlerValue) override
    {
      ArduinoJson::JsonVariant valueVariant = jsonValues[name];
      if (valueVariant.isNull() && !required) return true;
      if (valueVariant.isNull() || !valueVariant.is<ColorBaseType>()) return false;

      ColorBaseType valueData = valueVariant.as<ColorBaseType>();

      if (!isValidHexColor(valueData)) return false;
      if (validator && !validator(valueData)) return false;

      handlerValue = valueData;
      return true;
    }

    bool validateResult(HandlerValue& handlerValue, ArduinoJson::JsonObject& jsonValues) override
    {
      if (!handlerValue.has_value() && !required) return true;
      if (!handlerValue.has_value() || !Variant::holds_alternative<ColorBaseType>(*handlerValue)) return false;

      ColorBaseType valueData = Variant::get<ColorBaseType>(*handlerValue);

      if (!isValidHexColor(valueData)) return false;
      if (validator && !validator(valueData)) return false;

      jsonValues[name] = valueData;
      return true;
    }
  };
}