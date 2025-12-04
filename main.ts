let co2 = 0
let humDHT = 0
let tempDHT = 0
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
OLED.init(128, 64)
ESP8266_IoT.connectWifi("sr", "microman")
basic.pause(2000)
ESP8266_IoT.setMQTT(
ESP8266_IoT.SchemeList.TCP,
"microbit",
"",
"",
""
)
ESP8266_IoT.connectMQTT("172.20.10.2", 1883, true)
basic.pause(2000)
basic.forever(function () {
    tempDHT = Environment.dht11value(Environment.DHT11Type.DHT11_temperature_C, DigitalPin.P1)
    humDHT = Environment.dht11value(Environment.DHT11Type.DHT11_humidity, DigitalPin.P1)
    co2 = pins.analogReadPin(AnalogReadWritePin.P10)
    OLED.clear()
    OLED.writeStringNewLine("DHT Temp: " + convertToText(tempDHT) + " C")
    OLED.writeStringNewLine("DHT Hum: " + convertToText(humDHT) + " %")
    OLED.writeStringNewLine("Co2: " + convertToText(co2) + " v")
    if (ESP8266_IoT.wifiState(true)) {
        OLED.writeStringNewLine("Wifi Connected")
    } else {
        OLED.writeStringNewLine("Wifi NOT Connected")
    }
    if (ESP8266_IoT.isMqttBrokerConnected()) {
        OLED.writeStringNewLine("MQTT Connected")
    } else {
        OLED.writeStringNewLine("MQTT NOT Connected")
    }
    basic.pause(5000)
    ESP8266_IoT.publishMqttMessage(convertToText(tempDHT), "airsense/tempDHT", ESP8266_IoT.QosList.Qos0)
    ESP8266_IoT.publishMqttMessage(convertToText(humDHT), "airsense/humidity", ESP8266_IoT.QosList.Qos0)
    ESP8266_IoT.publishMqttMessage(convertToText(co2), "airsense/co2", ESP8266_IoT.QosList.Qos0)
})
