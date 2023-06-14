#!/usr/bin/python
import RPi.GPIO as GPIO
import time

global lastDistance
lastDistance = 0

PIN_TRIGGER = 7
PIN_ECHO = 11

def checkDistance():
	global pulse_start_time, pulse_end_time
	GPIO.output(PIN_TRIGGER, GPIO.HIGH)
	time.sleep(0.00001)
	GPIO.output(PIN_TRIGGER, GPIO.LOW)

	while GPIO.input(PIN_ECHO)==0:
		pulse_start_time = time.time()
	while GPIO.input(PIN_ECHO)==1:
		pulse_end_time = time.time()

	pulse_duration = pulse_end_time - pulse_start_time
	current = round(pulse_duration * 17241, 2)
	current = min(300, max(30, current))

	time.sleep(max(0.03, 0.06 - pulse_duration))

	return current

try:
	GPIO.setmode(GPIO.BOARD)

	GPIO.setup(PIN_TRIGGER, GPIO.OUT)
	GPIO.setup(PIN_ECHO, GPIO.IN)

	GPIO.output(PIN_TRIGGER, GPIO.LOW)

	print("Waiting for sensor to settle")

	while True:
		global maxVal, minVal, sum
		distances = []
		for x in range(0, 3):
			distances.append(checkDistance())

		sum = 0
		maxVal=distances[0]
		minVal=distances[0]

		for val in distances:
			maxVal=max(maxVal, val)
			minVal=min(minVal, val)
			sum += val
			
		avg = (sum-maxVal-minVal)/(len(distances)-2)

		if avg > lastDistance*1.5 or avg < lastDistance*0.5:
			newDistance = avg*0.3 + lastDistance*0.7
		else:
			newDistance = avg*0.7 + lastDistance*0.3

		print (round(newDistance), flush=True)
		lastDistance = newDistance

finally:
	GPIO.cleanup()