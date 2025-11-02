let tempDS = 0
let humDHT = 0
let tempDHT = 0
OLED.init(128, 64)
ESP8266_IoT.connectWifi("Telenor5216sal", "Navneformene2Skrekkelig5")
ESP8266_IoT.setMQTT(
ESP8266_IoT.SchemeList.TCP,
"",
"",
"",
""
)
ESP8266_IoT.connectMQTT("10.0.0.3", 1883, true)
basic.forever(function () {
    dht11_dht22.queryData(
    DHTtype.DHT11,
    DigitalPin.P2,
    true,
    false,
    true
    )
    tempDHT = dht11_dht22.readData(dataType.temperature)
    humDHT = dht11_dht22.readData(dataType.humidity)
    tempDS = Environment.Ds18b20Temp(DigitalPin.P1, Environment.ValType.DS18B20_temperature_C)
    OLED.clear()
    OLED.writeStringNewLine("DS Temp: " + convertToText(tempDS) + " C")
    OLED.writeStringNewLine("DHT Temp: " + convertToText(tempDHT) + " C")
    OLED.writeStringNewLine("DHT Hum: " + convertToText(humDHT) + " %")
    if (ESP8266_IoT.isMqttBrokerConnected()) {
        ESP8266_IoT.publishMqttMessage("{\"temperatureDS\":" + convertToText(tempDS) + "," + "\"humidity\" : " + convertToText(humDHT) + "," + "\"temperatureDHT\": " + convertToText(tempDHT) + "}", "airsense/tempDHT", ESP8266_IoT.QosList.Qos0)
    }
})
