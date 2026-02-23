#include "IotCommander.h"
#include <ArduinoJson.h>
#include <chrono>
#include <etl/optional.h>
#include <iostream>
#include <thread>
auto dht11Results = {
  IotCommander::Value(IotCommander::Value::Params{
            .name = "temperature_C",
            .type = IotCommander::ValueType::FLOAT,
            .required = true,
        }),
  IotCommander::Value(IotCommander::Value::Params{
            .name = "humidity_%",
            .type = IotCommander::ValueType::FLOAT,
            .required = true,
        }),
};
auto dht22Query = IotCommander::Query(IotCommander::Query::Params{
    .name = "dht22",
    .results = {
        IotCommander::Value(IotCommander::Value::Params{
            .name = "temperature_C",
            .type = IotCommander::ValueType::FLOAT,
            .required = true,
        }),
        IotCommander::Value(IotCommander::Value::Params{
            .name = "humidity_%",
            .type = IotCommander::ValueType::FLOAT,
            .required = true,
        }),
    },
    .handler = [](IotCommander::HandlerValue results[], etl::optional<const char*>& error)
    {

    },
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
  .actions = {

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
    device1.request("{ \"requestId\":\"lol\", \"query\":\"__SCHEMA__\", \"parameters\": { \"p1\":\"lol\", \"p2\":10 } }", output, IOTC_JSON_BUFFER_SIZE);
    std::cout << output << std::endl;
  }
}