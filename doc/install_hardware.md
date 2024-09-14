# Install Guide - Hardware

## Shopping List

Necessary hardware:
- [Raspberry PI 5](https://www.raspberrypi.com/products/raspberry-pi-5/)
- [Waveshare 11.9inch HDMI touch screen](https://www.waveshare.com/11.9inch-hdmi-lcd.htm)
- [SparkFun Ultrasonic Distance Sensor - HC-SR04](https://www.sparkfun.com/products/17777)
- [Jumper Wires female-female](https://blog.sparkfuneducation.com/what-is-jumper-wire)
- [32GB SD Card with Raspberry Pi OS](https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up/2)
- [Angle USB-C Cable](https://eu.ugreen.com/collections/cables/products/ugreen-usb-c-to-usb-c-cable-60w-1?variant=40400840556627)
- [20W USB Charger](https://eu.ugreen.com/collections/chargers/products/power-supply-pd-3-0?variant=40296226586707)
- [Raspberry Pi 4 Fan and Heatsink](https://www.adafruit.com/product/4794)

## Assembly hardware

Mount Raspberry PI to the [touch screen](https://www.waveshare.com/11.9inch-hdmi-lcd.htm) with included screws and distances. Connect HDMI and touch screen USB with included adapters. Install SD Card with Raspberry PI OS.

![Touch screen back](img/lcd.jpg)

![Raspberry PI + Touch screen](img/rpi.jpg)

Wire [distance sensor](https://www.sparkfun.com/products/17777) to GPIO pins of Raspberry PI. Connect the GND at first, otherwise, it will affect the normal work of the module.  

Wire fan to ensure proper cooling of the device. Mount the fan to the case in the place where it can efficiently cool the CPU down. Install the heatsink on Raspberry PI CPU.

![Wireing](img/wiring.png)

Power up Raspberry PI by connecting to USB charger. Make sure that touch screen is working correctly. It may have wrong orientation. Fix it using "Rotate Touch" button on the back of the screen 

## Troubleshooting

### Screen is Rotated
1. Open `Menu` > `Preferences` on Raspberry Pi
2. Select `Screen Configuration`.
3. In the new window, right-click the display.
4. Select `Orientation` and choose one of the four options (most probably **Left**).
5. Click the green check to confirm and apply the new orientation.

### Touch Screen is Rotated
- Use the hardware button on the back of the screen to change the orientation of the touchscreen.

### Screen is Black
1. **Ensure Power Supply:** Make sure your Raspberry PI is powered with a 5A power supply (25W or more).
2. **Toggle Power:** Try to turn the screen on/off using the physical button on the screen.
3. **Test with Secondary Screen:** Connect the Raspberry PI to another screen through HDMI output to verify if the Raspberry PI is working correctly.
4. **Direct Power to Screen:** Connect the power supply directly to the screen and HDMI cable from the screen to the Raspberry PI to check if the screen functions.
5. **USB Cable Power:** Replace the power supply by connecting a USB cable directly to the Raspberry PI to see if it provides enough power to the screen.
6. **Check Cables:** Replace the HDMI and USB cables with the connectors included in the screen kit to ensure they are functioning correctly.
