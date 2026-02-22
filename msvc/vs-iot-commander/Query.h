#pragma once

#include <etl/vector.h>

#include "ArduinoJson.h"
#include "Config.h"
#include "Serializable.h"
#include "Types.h"
#include "ValueDefinitions.h"

namespace IotCommander
{
  class Query : public Serializable
  {
  public:
    using ValueVariant = mpark::variant<
      Value::Int,
      Value::Range,
      Value::Float,
      Value::Double,
      Value::Bool,
      Value::String,
      Value::Enum,
      Value::Color
    >;
    using ResultVector = etl::vector<ValueVariant, IOTC_MAX_RESULTS>;

    struct Params
    {
      const char* name;
      ResultVector results;
      QueryHandler handler;
    };

    const char* name;
    ResultVector results;
    QueryHandler handler;

    Query(Params params) :
      name(params.name),
      results(params.results),
      handler(params.handler)
    {
    }

    void serialize(ArduinoJson::JsonObject& obj) override
    {
      obj["name"] = name;
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