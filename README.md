# Desk-HUD

Desk-HUD is a compact side monitor designed to enhance productivity and convenience in your workspace. It features an 11.9-inch touch screen connected to a Raspberry Pi hardware platform, providing quick access to essential features like a todo list, calendar, weather updates, clock, and smart device control for items such as window covers and air conditioning. With Desk-HUD, managing tasks, staying organized, and controlling your environment becomes effortless, all while keeping everything you need within reach on your desk.

![Desk view 1](doc/img/desk1.jpg)

![Desk view 2](doc/img/desk2.jpg)

# Key Features

## Date & Time Widget

![Date preview](doc/img/preview_date.png)

![Time preview](doc/img/preview_time.png)

- Clock and calendar
- Special event countdown
- Timezones time conversion

## Weather Widget

![Weather preview](doc/img/preview_weather.png)

- Current weather
- Temperature range for today
- Rain countdown
- Forecast for upcoming days

## Room Widget

![Covers preview](doc/img/preview_covers.png)

![Airconditioning preview](doc/img/preview_ac.png)

- Manual control of window covers
- Window covers scenes: Day, Night, Vide-call (reduced back-light)
- Monitor batteries of smart devices
- Open window alerts
- Air Conditioning control
- Current room temperature
- Room temperature history

## Calendar Widget

![Calendar preview](doc/img/preview_calendar.png)

- Today's meetings
- Busy/available timeline
- Next meeting info
- Ongoing meeting clock

## Todo Widget

![Todo preview](doc/img/preview_todo.png)

- Compatible with [Getting Things Done](https://gettingthingsdone.com/) approach
- List tasks for today
- Complete tasks
- Visualize task completion timeline
- Task inbox status

## Pomodoro Widget

![Pomodoro preview](doc/img/preview_pomodoro.png)

- Timer supporting [Pomodoro technique](https://en.wikipedia.org/wiki/Pomodoro_Technique)
- Last week history 

## Stocks Widget

![Stocks preview](doc/img/preview_stocks.png)

- Current stock price
- Daily change of the price
- Last months stock history

## Distance sensor

![Distance preview](doc/img/preview_distance.png)

- Darken the screen when no one is around
- Activate Desk HUD automatically by approaching the desk
- Power the screen off when inactive

## System Monitoring

![System preview](doc/img/preview_system.png)

- Monitor Desk HUD CPU and memory usage
- Monitor CPU temperature
- Control CPU fan (on/off/auto)

# Demo

You can experience a demo of Desk-HUD by visiting the following URL: [https://desk-hud.jmrlab.com](https://desk-hud.jmrlab.com). Please note that the demo uses simulated data to showcase the features, giving you a feel for Desk-HUD's functionality and is not connected to real systems. 

Additionally, there is a [video](https://www.youtube.com/watch?v=2UuWsG3Lnaw) showcasing the assembled project, complete with the wooden case and touch screen monitor.

# Installation Guide

- [Hardware setup](doc/install_hardware.md)
- [Software installation](doc/install_software.md)
- [Configuration](doc/configuration.md)
- [Wooden case assembly instructions](doc/install_case.md)

# Customization

Desk-HUD is specifically tailored to meet my unique requirements and is not intended as a one-size-fits-all solution. However, the project's source code is open for anyone to fork and customize according to their individual needs and preferences.

Some resources to get started:

- [System Design](doc/system_desgn.md)
- [Setup of Development Environment](doc/dev_setup.md)
- [Development Guide: Create a widget](doc/dev_create_widget.md)
