#include "IotCommander.h"
#include <ArduinoJson.h>
#include <chrono>
#include <etl/optional.h>
#include <iostream>
#include <thread>

auto action1 = IotCommander::Action(IotCommander::Action::Params{
  .name = "test",
  .parameters = {
  IotCommander::Value::Enum(IotCommander::Value::Enum::Params{
    .name = "p1",
    .required = true,
    .validator = [](const char* value) {
      IOTC_LOG("Hello from validator");
      return true;
    },
    .enumDefinition = {"lol"}
  }),
  IotCommander::Value::Range(IotCommander::Value::Range::Params{
    .name = "p2",
    .required = true,
    .min = 3,
    .max = 10
  }),
  },
  .results = {
  IotCommander::Value::Enum(IotCommander::Value::Enum::Params{
    .name = "r1",
    .required = true,
    .enumDefinition = {"lol"}
  }),
  IotCommander::Value::Range(IotCommander::Value::Range::Params{
    .name = "r2",
    .required = true,
    .validator = [](const int value) {
      IOTC_LOG("Hello from validator");
      return value == 7;
    },
    .min = 5,
    .max = 10,
  }),
  },
  .handler = [](IotCommander::HandlerValue params[], IotCommander::HandlerValue results[], etl::optional<const char*>& error) {
    auto* lol1 = IotCommander::Variant::get_if<const char*>(&params[0].value());
    auto* lol2 = IotCommander::Variant::get_if<int>(&params[1].value());
    IOTC_LOG(*lol1 << *lol2);
    results[0] = *lol1;
    results[1] = *lol2;
  }
  });

// Provide backing buffers and construct allocators with them (no default ctor available)
static uint8_t requestBuffer[IOTC_JSON_BUFFER_SIZE];
static uint8_t responseBuffer[IOTC_JSON_BUFFER_SIZE];
IotCommander::StaticBufferAllocator requestAllocator(requestBuffer, sizeof(requestBuffer));
IotCommander::StaticBufferAllocator responseAllocator(responseBuffer, sizeof(responseBuffer));

auto device1 = IotCommander::Device(IotCommander::Device::Params{
  .id = "id1",
  .name = "lol",
  .requestTopic = "lol",
  .responseTopic = "lol",
  .queries = {},
  .actions = {
  action1
  },
  .requestAllocator = requestAllocator,
  .responseAllocator = responseAllocator
  });

int main()
{
  while (true)
  {
    std::this_thread::sleep_for(std::chrono::milliseconds(1));
    char output[IOTC_JSON_BUFFER_SIZE];
    //device1.discovery(output, IOTC_JSON_BUFFER_SIZE);
    device1.request("{ \"requestId\":\"lol\", \"action\":\"test\", \"parameters\": { \"p1\":\"lol\", \"p2\":7 } }", output, IOTC_JSON_BUFFER_SIZE);
    std::cout << output << std::endl;
  }
}