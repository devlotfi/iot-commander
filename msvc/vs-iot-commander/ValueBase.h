#pragma once

#include <etl/optional.h>
#include <etl/variant.h>
#include <etl/vector.h>

#include "Config.h"
#include "Serializable.h"
#include "Types.h"

namespace IotCommander
{
  template <typename T>
  using Validtor = bool (*)(const T);

  template <typename T = int>
  class ValueBase : public Serializable
  {
  public:
    struct Params
    {
      const char* name;
      const char* typeName;
      bool required;
      Validtor<T> validator;
    };

    const char* name;
    const char* typeName;
    bool required;
    Validtor<T> validator;

    ValueBase(Params params) :
      name(params.name),
      typeName(params.typeName),
      required(params.required),
      validator(params.validator)
    {
    }

    void serialize(ArduinoJson::JsonObject& obj) override {
      obj["name"] = name;
      obj["required"] = required;
      obj["type"] = typeName;
    }

    virtual bool validateParameter(ArduinoJson::JsonObject& jsonValues, HandlerValue& handlerValue) = 0;
    virtual bool validateResult(HandlerValue& handlerValue, ArduinoJson::JsonObject& jsonValues) = 0;
  };
}