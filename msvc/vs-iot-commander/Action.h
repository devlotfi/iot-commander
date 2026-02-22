#pragma once

#include <etl/vector.h>

#include "ArduinoJson.h"
#include "Config.h"
#include "Serializable.h"
#include "Types.h"
#include "ValueDefinitions.h"


namespace IotCommander
{
  class Action : public Serializable
  {
  public:
    using ValueVariant = Variant::variant<
      Value::Int,
      Value::Range,
      Value::Float,
      Value::Double,
      Value::Bool,
      Value::String,
      Value::Enum,
      Value::Color
    >;
    using ParameterVector = etl::vector<ValueVariant, IOTC_MAX_PARAMETERS>;
    using ResultVector = etl::vector<ValueVariant, IOTC_MAX_RESULTS>;

    struct Params
    {
      const char* name;
      ParameterVector parameters;
      ResultVector results;
      ActionHandler handler;
    };

    const char* name;
    ParameterVector parameters;
    ResultVector results;
    ActionHandler handler;

    Action(Params params) :
      name(params.name),
      parameters(params.parameters),
      results(params.results),
      handler(params.handler)
    {
    }

    void serialize(ArduinoJson::JsonObject& obj) override
    {
      obj["name"] = name;
      for (auto item : parameters)
      {
        auto parameterObj = obj["parameters"].add<ArduinoJson::JsonObject>();
        Variant::visit([&](auto& value) {
          value.serialize(parameterObj);
          }, item);
      }
      for (auto item : results)
      {
        auto parameterObj = obj["results"].add<ArduinoJson::JsonObject>();
        Variant::visit([&](auto& value) {
          value.serialize(parameterObj);
          }, item);
      }
    }
  };
}