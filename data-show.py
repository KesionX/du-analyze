# -*-coding:utf-8 -*-

import sys
import json
import matplotlib.pyplot as plt

file_path = 'test1.json'
with open(file_path) as f:
  js = json.load(f) 

sizeTypes = js

for sizePrices in sizeTypes:
  dayPrices = sizePrices['dayPrices']
  daySize = sizePrices['size']
  print dayPrices
  row = [0 for i in range(len(dayPrices))]
  for num in range(0,len(dayPrices)):
    row[num] = num
  for num in range(0,len(dayPrices)):
    dayPrices[num] = dayPrices[num] / 100
  dayPrices = dayPrices[::-1]
  plt.plot(row, dayPrices, marker='o', linewidth=2, color='b') 
  plt.title("SIZE: " + daySize, fontsize=24, color='r')
  plt.xlabel("date", fontsize=14, color='g')
  plt.ylabel("price", fontsize=14, color='g')
  plt.tick_params(axis='both', labelsize=14)
  plt.show()