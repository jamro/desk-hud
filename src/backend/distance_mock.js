const data = `77
69
60
57
54
50
55
61
64
68
73
77
76
77
61
77
61
61
61
77
77
60
63
77
77
76
60
77
62
61
62
62
74
61
76
77
73
61
61
72
79
80
71
65
66
74
79
79
79
71
80
67
67
68
69
61
72
72
72
75
61
300
87
80
300
101
95
300
93
91
106
107
96
300
115
115
300
300
300
120
300
296
300
300
300
300
299
300
300
297
149
151
153
297
300
158
295
297
300
300
293
295
295
300
283
300
282
282
287
300
300
296
299
300
300
300
300
300
298
284
300
283
284
300
300
283
283
283
283
283
283
283
283
283
283
283
282
283
282
282
283
285
282
282
282
283
279
282
283
283
283
300
283
282
283
283
281
283
283
283
283
283
283
295
296
284
283
283
300
298
283
300
282
300
283
282
283
284
300
283
283
283
283
283
296
282
283
283
281
282
300
300
300
300
299
155
300
300
297
300
296
300
296
298
300
123
300
300
116
112
101
95
300
300
105
86
106
300
300
62
300
74
75
61
85
50
70
52
70
81
79
80
63
66
65
65
62
61
63
62
60
61
62
61
73
73
63
60
60
61
62
61
61
61
61
62
62
61
62
73
70
70
74
76
61
60
62
60
62
62
62
62
61
75
61
61
61
61
62
61
61
62
61
61
61
61
64
63
74
73
74
75
61
75
75
61
74
64
75`.split("\n")


let i = 0

setInterval(() => {
  console.log(0)
  return
  //if(Math.random() > 0.99) throw new Error('Some test error')
  if(data[i]) {
    console.log(data[i])
  }
  i++
  i = i % data.length
}, 50)