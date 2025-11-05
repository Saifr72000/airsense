let tempDS = 0
let humDHT = 0
let tempDHT = 0
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
OLED.init(128, 64)
ESP8266_IoT.connectWifi("Skywalker Main", "zulfi107")
ESP8266_IoT.setMQTT(
ESP8266_IoT.SchemeList.TCP,
"",
"",
"",
""
)
ESP8266_IoT.connectMQTT("192.168.0.122", 1883, true)
basic.pause(2000)
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
    if (ESP8266_IoT.wifiState(true)) {
        OLED.writeStringNewLine("Wifi Connected")
    } else {
        OLED.writeStringNewLine("Wifi NOT Connected")
    }
    if (ESP8266_IoT.isMqttBrokerConnected()) {
        OLED.writeStringNewLine("MQTT Connected")
        ESP8266_IoT.publishMqttMessage("{\"temperatureDS\":" + convertToText(tempDS) + "," + "\"humidity\" : " + convertToText(humDHT) + "," + "\"temperatureDHT\": " + convertToText(tempDHT) + "}", "airsense/tempDHT", ESP8266_IoT.QosList.Qos0)
    } else {
        OLED.writeStringNewLine("MQTT NOT Connected")
    }
    basic.pause(5000)
})
