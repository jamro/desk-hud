#!/usr/bin/python
import gpiod
import time

global lastDistance
lastDistance = 0

PIN_TRIGGER = 4  # GPIO4
PIN_ECHO = 17    # GPIO17

def checkDistance(line_trigger, line_echo):
    global pulse_start_time, pulse_end_time
    line_trigger.set_value(1)
    time.sleep(0.00001)
    line_trigger.set_value(0)

    # Wait for the echo pin to go high
    while line_echo.get_value() == 0:
        pulse_start_time = time.time()

    # Wait for the echo pin to go low
    while line_echo.get_value() == 1:
        pulse_end_time = time.time()

    pulse_duration = pulse_end_time - pulse_start_time
    current = round(pulse_duration * 17241, 2)
    current = min(300, max(30, current))

    time.sleep(max(0.03, 0.06 - pulse_duration))

    return current

try:
    chip = gpiod.Chip('gpiochip0')

    line_trigger = chip.get_line(PIN_TRIGGER)
    line_echo = chip.get_line(PIN_ECHO)

    # Request lines
    line_trigger.request(consumer='trigger', type=gpiod.LINE_REQ_DIR_OUT)
    line_echo.request(consumer='echo', type=gpiod.LINE_REQ_DIR_IN)

    line_trigger.set_value(0)

    print("Waiting for sensor to settle")

    while True:
        global maxVal, minVal, sum
        distances = []
        for x in range(0, 3):
            distances.append(checkDistance(line_trigger, line_echo))

        sum = 0
        maxVal = distances[0]
        minVal = distances[0]

        for val in distances:
            maxVal = max(maxVal, val)
            minVal = min(minVal, val)
            sum += val

        avg = (sum - maxVal - minVal) / (len(distances) - 2)

        if avg > lastDistance * 1.5 or avg < lastDistance * 0.5:
            newDistance = avg * 0.3 + lastDistance * 0.7
        else:
            newDistance = avg * 0.7 + lastDistance * 0.3

        print(round(newDistance), flush=True)
        lastDistance = newDistance

finally:
    # Release lines
    line_trigger.release()
    line_echo.release()
