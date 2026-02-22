#pragma once

#include <etl/optional.h>
#include <etl/variant.h>
#include <mpark/variant.hpp>

#include "Config.h"

namespace IotCommander
{
  namespace Variant = mpark;

  using HandlerValue = etl::optional<mpark::variant<int, float, double, bool, const char*>>;
  using QueryHandler = void (*)(HandlerValue[], etl::optional<const char*>&);
  using ActionHandler = void (*)(HandlerValue[], HandlerValue[], etl::optional<const char*>&);

  enum RequestType
  {
    QUERY,
    ACTION
  };

  class LibraryErrors
  {
  public:
    static constexpr const char* INVALID_JSON = "INVALID_JSON";
    static constexpr const char* INVALID_FORMAT = "INVALID_FORMAT";
    static constexpr const char* ACTION_NOT_FOUND = "ACTION_NOT_FOUND";
    static constexpr const char* QUERY_NOT_FOUND = "QUERY_NOT_FOUND";
    static constexpr const char* INVALID_PARAMETERS = "INVALID_PARAMETERS";
    static constexpr const char* INVALID_RESULTS = "INVALID_RESULTS";
  };

  class ResponseStatus
  {
  public:
    static constexpr const char* OK = "OK";
    static constexpr const char* ERROR = "ERROR";
  };
}