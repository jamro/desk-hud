export default class DemoSocket {
  constructor() {
    this._listeners = {}
    const now = new Date().getTime()

    const hour = 60*60*1000
    const day = 24*hour
    this._pomodoroData =  {
      widgetId: 'pomodoro',
      payload: {
        history: [
          now - hour,
          now - day,
          now - day,
          now - day,
          now - day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 4*day,
          now - 4*day,
          now - 6*day,
          now - 6*day,
          now - 6*day,
        ]
      }
    }
    

    this._roomData = {"widgetId":"room","payload":{"ac":{"entity_id":"climate.klimatyzator","state":"off","attributes":{"hvac_modes":["auto","cool","dry","fan_only","heat","off"],"min_temp":8,"max_temp":30,"target_temp_step":1,"fan_modes":["auto","low","medium low","medium","medium high","high"],"preset_modes":["eco","away","boost","none","sleep"],"swing_modes":["off","vertical","horizontal","both"],"current_temperature":22,"temperature":21,"fan_mode":"auto","preset_mode":"none","swing_mode":"off","friendly_name":"Klimatyzator","supported_features":57},"context":{"id":"01H2E0ZAPPD6FGTVAJPSC1DQBA","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:27:34.509Z","last_updated":"2023-06-08T17:30:52.502Z","id":"ac"},"door1":{"entity_id":"binary_sensor.lumi_lumi_sensor_magnet_aq2_opening","state":"off","attributes":{"device_class":"opening","friendly_name":"Poddasze / Sypialnia Glowna / Drzwi Front Lewe Opening"},"context":{"id":"01H2E15CFJF2M1XNWW4GMP2ZNE","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:34:10.930Z","last_updated":"2023-06-08T17:34:10.930Z","id":"door1"},"door2":{"entity_id":"binary_sensor.lumi_lumi_sensor_magnet_aq2_opening_2","state":"off","attributes":{"device_class":"opening","friendly_name":"Poddasze / Sypialnia Glowna / Drzwi Front Prawe Opening"},"context":{"id":"01H2DGW4FH1E5F27YMD4VG3XTG","parent_id":null,"user_id":null},"last_changed":"2023-06-08T12:49:30.609Z","last_updated":"2023-06-08T12:49:30.609Z","id":"door2"},"door3":{"entity_id":"binary_sensor.lumi_lumi_sensor_magnet_aq2_opening_3","state":"off","attributes":{"device_class":"opening","friendly_name":"Poddasze / Sypialnia Glowna / Drzwi Boczne Opening"},"context":{"id":"01H28CGGE1YC619EWSZ7NNKH8V","parent_id":null,"user_id":null},"last_changed":"2023-06-06T12:57:03.169Z","last_updated":"2023-06-06T12:57:03.169Z","id":"door3"},"cover3":{"entity_id":"cover.lumi_lumi_curtain_acn002_cover","state":"open","attributes":{"current_position":100,"friendly_name":"Poddasze / Sypialnia Glowna / Roleta Boczna Cover","supported_features":15},"context":{"id":"01H2E0SSZ2NA27BB3JAKN53TTF","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:27:51.522Z","last_updated":"2023-06-08T17:27:51.522Z","id":"cover3"},"cover1":{"entity_id":"cover.poddasze_sypialnia_glowna_roleta_front_lewa_cover","state":"opening","attributes":{"current_position":100,"friendly_name":"Poddasze / Sypialnia Glowna / Roleta Front Lewa Cover","supported_features":15},"context":{"id":"01H2E0S6PS0S0WR3AJXY7SZDA1","parent_id":null,"user_id":"6eca4b5cd6b0476f9a8271d7d30d855d"},"last_changed":"2023-06-08T17:27:32.390Z","last_updated":"2023-06-08T17:27:32.390Z","id":"cover1"},"cover2":{"entity_id":"cover.poddasze_sypialnia_glowna_roleta_front_prawa_cover","state":"open","attributes":{"current_position":100,"friendly_name":"Poddasze / Sypialnia Glowna / Roleta Front Prawa Cover","supported_features":15},"context":{"id":"01H2E0SSWDB2Q2X8FX55XDTJTV","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:27:51.437Z","last_updated":"2023-06-08T17:27:51.437Z","id":"cover2"},"cover5":{"entity_id":"cover.lumi_lumi_curtain_acn002_cover_3","state":"open","attributes":{"current_position":100,"friendly_name":"Poddasze / Sypialnia Glowna / Roleta Ogrod Prawa Cover","supported_features":15},"context":{"id":"01H2E0T9MV1KY67JHQSRZ3ASAK","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:28:07.579Z","last_updated":"2023-06-08T17:28:07.579Z","id":"cover5"},"cover4":{"entity_id":"cover.lumi_lumi_curtain_acn002_cover_4","state":"open","attributes":{"current_position":100,"friendly_name":"Poddasze / Sypialnia Glowna / Roleta Ogrod Lewa Cover","supported_features":15},"context":{"id":"01H2E0T9GT4BS99A2KGQK87NVV","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:28:07.450Z","last_updated":"2023-06-08T17:28:07.450Z","id":"cover4"},"cover3Battery":{"entity_id":"sensor.lumi_lumi_curtain_acn002_battery","state":"50","attributes":{"state_class":"measurement","unit_of_measurement":"%","device_class":"battery","friendly_name":"Poddasze / Sypialnia Glowna / Roleta Boczna Battery"},"context":{"id":"01H2E11PSD03FQTJR9QK7G293K","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:32:10.413Z","last_updated":"2023-06-08T17:32:10.413Z","id":"cover3Battery"},"tempBattery":{"entity_id":"sensor.poddasze_sypialnia_glowna_termometr_battery","state":"89","attributes":{"state_class":"measurement","battery_voltage":3,"unit_of_measurement":"%","device_class":"battery","friendly_name":"Poddasze / Sypialnia Glowna / Termometr Battery"},"context":{"id":"01H1NGX7GMP6YDST6MS3S0S6MB","parent_id":null,"user_id":null},"last_changed":"2023-05-30T05:08:20.116Z","last_updated":"2023-05-30T05:08:20.116Z","id":"tempBattery"},"temp":{"entity_id":"sensor.poddasze_sypialnia_glowna_termometr_temperature","state":"23.1","attributes":{"state_class":"measurement","unit_of_measurement":"°C","device_class":"temperature","friendly_name":"Poddasze / Sypialnia Glowna / Termometr Temperature"},"context":{"id":"01H2DZY4G69PCB2DVX3K4CQ8H3","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:12:44.806Z","last_updated":"2023-06-08T17:12:44.806Z","id":"temp","history":["23.1"]},"cover1Battery":{"entity_id":"sensor.poddasze_sypialnia_glowna_roleta_front_lewa_battery","state":"61","attributes":{"state_class":"measurement","unit_of_measurement":"%","device_class":"battery","friendly_name":"Poddasze / Sypialnia Glowna / Roleta Front Lewa Battery"},"context":{"id":"01H2DH95EXZ0JD2WQKQN2A0KZQ","parent_id":null,"user_id":null},"last_changed":"2023-06-08T12:56:37.597Z","last_updated":"2023-06-08T12:56:37.597Z","id":"cover1Battery"},"cover2Battery":{"entity_id":"sensor.poddasze_sypialnia_glowna_roleta_front_prawa_battery","state":"55","attributes":{"state_class":"measurement","unit_of_measurement":"%","device_class":"battery","friendly_name":"Poddasze / Sypialnia Glowna / Roleta Front Prawa Battery"},"context":{"id":"01H2E17GBQVQV5HT6S9F3RMGA2","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:35:20.439Z","last_updated":"2023-06-08T17:35:20.439Z","id":"cover2Battery"},"cover5Battery":{"entity_id":"sensor.lumi_lumi_curtain_acn002_battery_3","state":"54","attributes":{"state_class":"measurement","unit_of_measurement":"%","device_class":"battery","friendly_name":"Poddasze / Sypialnia Glowna / Roleta Ogrod Prawa Battery"},"context":{"id":"01H2DCHV6005Q4998P37HM7SWK","parent_id":null,"user_id":null},"last_changed":"2023-06-08T11:33:59.104Z","last_updated":"2023-06-08T11:33:59.104Z","id":"cover5Battery"},"cover4Battery":{"entity_id":"sensor.lumi_lumi_curtain_acn002_battery_4","state":"67","attributes":{"state_class":"measurement","unit_of_measurement":"%","device_class":"battery","friendly_name":"Poddasze / Sypialnia Glowna / Roleta Ogrod Lewa Battery"},"context":{"id":"01H2DZBDWW86RDFCS4ASEK7PD2","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:02:31.836Z","last_updated":"2023-06-08T17:02:31.836Z","id":"cover4Battery"},"door1Battery":{"entity_id":"sensor.lumi_lumi_sensor_magnet_aq2_battery","state":"73","attributes":{"state_class":"measurement","battery_size":"CR1632","battery_quantity":1,"battery_voltage":3.02,"unit_of_measurement":"%","device_class":"battery","friendly_name":"Poddasze / Sypialnia Glowna / Drzwi Front Lewe Battery"},"context":{"id":"01H2DZ7F0SQZ81HT00Y4N1WCPN","parent_id":null,"user_id":null},"last_changed":"2023-06-08T17:00:21.913Z","last_updated":"2023-06-08T17:00:21.913Z","id":"door1Battery"},"door2Battery":{"entity_id":"sensor.lumi_lumi_sensor_magnet_aq2_battery_2","state":"16","attributes":{"state_class":"measurement","battery_size":"CR1632","battery_quantity":1,"battery_voltage":2.98,"unit_of_measurement":"%","device_class":"battery","friendly_name":"Poddasze / Sypialnia Glowna / Drzwi Front Prawe Battery"},"context":{"id":"01H22JCTYXH5839H824YXNZ8HB","parent_id":null,"user_id":null},"last_changed":"2023-06-04T06:44:27.741Z","last_updated":"2023-06-04T06:44:27.741Z","id":"door2Battery"},"door3Battery":{"entity_id":"sensor.lumi_lumi_sensor_magnet_aq2_battery_3","state":"70","attributes":{"state_class":"measurement","battery_size":"CR1632","battery_quantity":1,"battery_voltage":3.01,"unit_of_measurement":"%","device_class":"battery","friendly_name":"Poddasze / Sypialnia Glowna / Drzwi Boczne Battery"},"context":{"id":"01H2DYT2SJCQWVNGGGNARGSMAA","parent_id":null,"user_id":null},"last_changed":"2023-06-08T16:53:03.410Z","last_updated":"2023-06-08T16:53:03.410Z","id":"door3Battery"}}}

    this._roomData.payload.temp.history = ["22.4","22.4","22.4","22.4","22.4","22.4","22.4","22.4","22.4","22.4","22.4","22.4","22.4","22.4","22.4","24.0","24.0","23.3","23.4","23.4","23.4","23.4","23.4","23.4","23.4","23.4","23.4","23.4","23.4","23.4","23.4","23.4","23.1","23.1","23.1","24.0","24.1","23.6","23.6","23.5","23.5","23.5","23.4","23.4","23.4","23.3","23.1","23.0"]

    this._todoData = {
      "widgetId": "todo",
      "payload": {
        "inbox": [
          {
            "id": "34645645643563456",
            "title": "inbox item 1",
            "position": "00000000000000000000",
            "status": "needsAction",
            "completed": null,
            "due": null
          },
          {
            "id": "93823723423452345",
            "title": "inbox item 2",
            "position": "00000000000000000001",
            "status": "needsAction",
            "completed": null,
            "due": null
          }
        ],
        "action": [
          {
            "id": "7645375467457645674567",
            "title": "check emails",
            "position": "00000000000000000000",
            "status": "completed",
            "completed": now - 3*60*60*1000,
            "due": null
          },
          {
            "id": "345634563475643652345",
            "title": "review project timeline",
            "position": "00000000000000000001",
            "status": (new Date().getHours() > 12) ? "completed" : "needsAction",
            "completed": (new Date().getHours() > 12) ? now - 5*60*60*1000 : null,
            "due": null
          },
          {
            "id": "754745674567543456",
            "title": "schedule dentist appointment",
            "position": "00000000000000000006",
            "status": "needsAction",
            "completed": null,
            "due": null
          },
          {
            "id": "74567457453456343456",
            "title": "complete financial report",
            "position": "00000000000000000009",
            "status": "needsAction",
            "completed": null,
            "due": null
          },
          {
            "id": "8928377200011234",
            "title": "call rob",
            "position": "00000000000000000010",
            "status": "needsAction",
            "completed": null,
            "due": null
          }
        ]
      }
    }

    setTimeout(() => {
      this._publish('connect');
      this._publish('config', this._getConfig())
      this._publish('widget', this._getWeatherData())
      this._publish('widget', this._getTodoData())
      this._publish('widget', this._getCalendarData())
      this._publish('widget', this._getRoomData())
      this._publish('widget', this._getPomodoroData())
    }, 500)

    setTimeout(() => {
      this._publish('distance', {
        "distance": 45 + 5*Math.random(),
        "sensorDataAge": 33,
        "action": "wakeUp"
      })
    }, 1000)

    setInterval(() => {
      this._publish('distance', {
        "distance": 45 + 5*Math.random(),
        "sensorDataAge": 33,
      })
    }, 1000)
  }  

  _publish(eventName, ...args) {
    if(!this._listeners[eventName]) {
      this._listeners[eventName] = []
    }
    this._listeners[eventName].forEach(c => c(...args))
  }

  _getRoomData() {
    return this._roomData
  }

  _getPomodoroData() {
    return this._pomodoroData
  }

  _getCalendarData() {
    const now = Math.floor((new Date().getTime())/(1000*60*60))*1000*60*60
    return {
      widgetId: 'calendar',
      payload: [
        {
          "id": "822245245",
          "summary": "Product launch discussion",
          "start": now - 5.5*60*60*1000,
          "end": now - 5*60*60*1000,
          "allDay": false
        },
        {
          "id": "63472245612",
          "summary": "Stand-up",
          "start": now - 3*60*60*1000,
          "end": now - 2*60*60*1000,
          "allDay": false
        },
        {
        "id": "345634563456345634",
        "summary": "Project kickoff meeting",
        "start": now,
        "end": now + 1.5*60*60*1000,
        "allDay": false
        },
        {
          "id": "6573456754633",
          "summary": "Marketing strategy brainstorm",
          "start": now + 2*60*60*1000,
          "end": now + 2.5*60*60*1000,
          "allDay": false
        },
        {
          "id": "567345673",
          "summary": "Weekly team sync",
          "start": now + 3*60*60*1000,
          "end": now + 3.25*60*60*1000,
          "allDay": false
        },
      ]
    }
  }

  _getTodoData() {
    return this._todoData
  }

  _getWeatherData() {
    const now = Math.round(new Date().getTime()/1000)
    const data = {"widgetId":"weather","payload":{"current":{"coord":{"lon":19.9369,"lat":50.0619},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"base":"stations","main":{"temp":21.63,"feels_like":21.55,"temp_min":17.54,"temp_max":22.1,"pressure":1015,"humidity":65},"visibility":10000,"wind":{"speed":6.17,"deg":70},"clouds":{"all":40},"dt":1686238399,"sys":{"type":2,"id":2009211,"country":"PL","sunrise":1686191531,"sunset":1686249992},"timezone":7200,"id":3085041,"name":"Śródmieście","cod":200},"forecast":{"cod":"200","message":0,"cnt":40,"list":[{"dt":1686247200,"main":{"temp":20.11,"feels_like":20.11,"temp_min":17.07,"temp_max":20.11,"pressure":1015,"sea_level":1015,"grnd_level":988,"humidity":74,"temp_kf":3.04},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":58},"wind":{"speed":2.43,"deg":65,"gust":4.87},"visibility":10000,"pop":0.59,"rain":{"3h":0.81},"sys":{"pod":"d"},"dt_txt":"2023-06-08 18:00:00"},{"dt":1686258000,"main":{"temp":16.98,"feels_like":16.98,"temp_min":14.66,"temp_max":16.98,"pressure":1015,"sea_level":1015,"grnd_level":989,"humidity":86,"temp_kf":2.32},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":67},"wind":{"speed":2.03,"deg":64,"gust":3.25},"visibility":10000,"pop":0.36,"sys":{"pod":"n"},"dt_txt":"2023-06-08 21:00:00"},{"dt":1686268800,"main":{"temp":14.12,"feels_like":14.15,"temp_min":14.12,"temp_max":14.12,"pressure":1014,"sea_level":1014,"grnd_level":988,"humidity":98,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":84},"wind":{"speed":2.22,"deg":54,"gust":3.97},"visibility":10000,"pop":0.51,"rain":{"3h":0.34},"sys":{"pod":"n"},"dt_txt":"2023-06-09 00:00:00"},{"dt":1686279600,"main":{"temp":14.81,"feels_like":14.93,"temp_min":14.81,"temp_max":14.81,"pressure":1013,"sea_level":1013,"grnd_level":987,"humidity":99,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":99},"wind":{"speed":2.42,"deg":63,"gust":6.43},"visibility":4044,"pop":0.83,"rain":{"3h":2.49},"sys":{"pod":"d"},"dt_txt":"2023-06-09 03:00:00"},{"dt":1686290400,"main":{"temp":15.92,"feels_like":16.07,"temp_min":15.92,"temp_max":15.92,"pressure":1014,"sea_level":1014,"grnd_level":988,"humidity":96,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":2.96,"deg":62,"gust":4.5},"visibility":10000,"pop":0.86,"rain":{"3h":1.53},"sys":{"pod":"d"},"dt_txt":"2023-06-09 06:00:00"},{"dt":1686301200,"main":{"temp":17.48,"feels_like":17.63,"temp_min":17.48,"temp_max":17.48,"pressure":1014,"sea_level":1014,"grnd_level":988,"humidity":90,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":3.2,"deg":65,"gust":4.01},"visibility":10000,"pop":0.61,"rain":{"3h":0.15},"sys":{"pod":"d"},"dt_txt":"2023-06-09 09:00:00"},{"dt":1686312000,"main":{"temp":19.24,"feels_like":19.39,"temp_min":19.24,"temp_max":19.24,"pressure":1013,"sea_level":1013,"grnd_level":988,"humidity":83,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":2.06,"deg":81,"gust":2.68},"visibility":10000,"pop":0.91,"rain":{"3h":0.62},"sys":{"pod":"d"},"dt_txt":"2023-06-09 12:00:00"},{"dt":1686322800,"main":{"temp":18.46,"feels_like":18.74,"temp_min":18.46,"temp_max":18.46,"pressure":1013,"sea_level":1013,"grnd_level":987,"humidity":91,"temp_kf":0},"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":2.2,"deg":58,"gust":3.42},"visibility":10000,"pop":1,"rain":{"3h":3.02},"sys":{"pod":"d"},"dt_txt":"2023-06-09 15:00:00"},{"dt":1686333600,"main":{"temp":16.31,"feels_like":16.48,"temp_min":16.31,"temp_max":16.31,"pressure":1013,"sea_level":1013,"grnd_level":987,"humidity":95,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":99},"wind":{"speed":2.01,"deg":53,"gust":3.58},"visibility":10000,"pop":1,"rain":{"3h":1.62},"sys":{"pod":"d"},"dt_txt":"2023-06-09 18:00:00"},{"dt":1686344400,"main":{"temp":15.2,"feels_like":15.23,"temp_min":15.2,"temp_max":15.2,"pressure":1013,"sea_level":1013,"grnd_level":987,"humidity":94,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":99},"wind":{"speed":1.19,"deg":71,"gust":1.34},"visibility":10000,"pop":0.24,"sys":{"pod":"n"},"dt_txt":"2023-06-09 21:00:00"},{"dt":1686355200,"main":{"temp":15.03,"feels_like":15.1,"temp_min":15.03,"temp_max":15.03,"pressure":1013,"sea_level":1013,"grnd_level":987,"humidity":96,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":99},"wind":{"speed":1.7,"deg":51,"gust":2.3},"visibility":10000,"pop":0.34,"rain":{"3h":0.16},"sys":{"pod":"n"},"dt_txt":"2023-06-10 00:00:00"},{"dt":1686366000,"main":{"temp":14.23,"feels_like":14.27,"temp_min":14.23,"temp_max":14.23,"pressure":1013,"sea_level":1013,"grnd_level":988,"humidity":98,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":97},"wind":{"speed":2.43,"deg":52,"gust":5.21},"visibility":10000,"pop":0.13,"sys":{"pod":"d"},"dt_txt":"2023-06-10 03:00:00"},{"dt":1686376800,"main":{"temp":15.61,"feels_like":15.76,"temp_min":15.61,"temp_max":15.61,"pressure":1014,"sea_level":1014,"grnd_level":988,"humidity":97,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":98},"wind":{"speed":3.33,"deg":54,"gust":6.22},"visibility":5352,"pop":0.22,"rain":{"3h":0.17},"sys":{"pod":"d"},"dt_txt":"2023-06-10 06:00:00"},{"dt":1686387600,"main":{"temp":15.88,"feels_like":16.06,"temp_min":15.88,"temp_max":15.88,"pressure":1015,"sea_level":1015,"grnd_level":989,"humidity":97,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":3.53,"deg":38,"gust":6.81},"visibility":10000,"pop":0.9,"rain":{"3h":0.73},"sys":{"pod":"d"},"dt_txt":"2023-06-10 09:00:00"},{"dt":1686398400,"main":{"temp":16.94,"feels_like":17.14,"temp_min":16.94,"temp_max":16.94,"pressure":1015,"sea_level":1015,"grnd_level":989,"humidity":94,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":5.89,"deg":44,"gust":8.97},"visibility":10000,"pop":1,"rain":{"3h":1.24},"sys":{"pod":"d"},"dt_txt":"2023-06-10 12:00:00"},{"dt":1686409200,"main":{"temp":15.3,"feels_like":15.39,"temp_min":15.3,"temp_max":15.3,"pressure":1015,"sea_level":1015,"grnd_level":989,"humidity":96,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":99},"wind":{"speed":6.12,"deg":49,"gust":10.79},"visibility":10000,"pop":0.65,"rain":{"3h":0.32},"sys":{"pod":"d"},"dt_txt":"2023-06-10 15:00:00"},{"dt":1686420000,"main":{"temp":13.94,"feels_like":13.92,"temp_min":13.94,"temp_max":13.94,"pressure":1017,"sea_level":1017,"grnd_level":990,"humidity":97,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":5.9,"deg":57,"gust":11.94},"visibility":8495,"pop":0.83,"rain":{"3h":0.61},"sys":{"pod":"d"},"dt_txt":"2023-06-10 18:00:00"},{"dt":1686430800,"main":{"temp":13.57,"feels_like":13.52,"temp_min":13.57,"temp_max":13.57,"pressure":1018,"sea_level":1018,"grnd_level":991,"humidity":97,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":5.77,"deg":54,"gust":11.54},"visibility":10000,"pop":0.69,"rain":{"3h":1.13},"sys":{"pod":"n"},"dt_txt":"2023-06-10 21:00:00"},{"dt":1686441600,"main":{"temp":12.76,"feels_like":12.65,"temp_min":12.76,"temp_max":12.76,"pressure":1018,"sea_level":1018,"grnd_level":992,"humidity":98,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":5.24,"deg":50,"gust":11.06},"visibility":10000,"pop":0.66,"rain":{"3h":0.6},"sys":{"pod":"n"},"dt_txt":"2023-06-11 00:00:00"},{"dt":1686452400,"main":{"temp":11.44,"feels_like":11.12,"temp_min":11.44,"temp_max":11.44,"pressure":1019,"sea_level":1019,"grnd_level":992,"humidity":95,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":4.69,"deg":41,"gust":10.25},"visibility":10000,"pop":0.44,"rain":{"3h":0.33},"sys":{"pod":"d"},"dt_txt":"2023-06-11 03:00:00"},{"dt":1686463200,"main":{"temp":11.82,"feels_like":11.36,"temp_min":11.82,"temp_max":11.82,"pressure":1020,"sea_level":1020,"grnd_level":993,"humidity":88,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":98},"wind":{"speed":4.64,"deg":52,"gust":10.09},"visibility":10000,"pop":0.4,"sys":{"pod":"d"},"dt_txt":"2023-06-11 06:00:00"},{"dt":1686474000,"main":{"temp":11.47,"feels_like":11.1,"temp_min":11.47,"temp_max":11.47,"pressure":1021,"sea_level":1021,"grnd_level":995,"humidity":93,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":99},"wind":{"speed":3.77,"deg":65,"gust":10.13},"visibility":10000,"pop":0.31,"rain":{"3h":0.36},"sys":{"pod":"d"},"dt_txt":"2023-06-11 09:00:00"},{"dt":1686484800,"main":{"temp":15.1,"feels_like":14.78,"temp_min":15.1,"temp_max":15.1,"pressure":1020,"sea_level":1020,"grnd_level":994,"humidity":81,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":98},"wind":{"speed":4.73,"deg":72,"gust":8.73},"visibility":10000,"pop":0.34,"rain":{"3h":0.17},"sys":{"pod":"d"},"dt_txt":"2023-06-11 12:00:00"},{"dt":1686495600,"main":{"temp":14.35,"feels_like":14.11,"temp_min":14.35,"temp_max":14.35,"pressure":1021,"sea_level":1021,"grnd_level":995,"humidity":87,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":82},"wind":{"speed":6.04,"deg":85,"gust":9.48},"visibility":10000,"pop":0.74,"rain":{"3h":0.98},"sys":{"pod":"d"},"dt_txt":"2023-06-11 15:00:00"},{"dt":1686506400,"main":{"temp":11.85,"feels_like":11.49,"temp_min":11.85,"temp_max":11.85,"pressure":1022,"sea_level":1022,"grnd_level":995,"humidity":92,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":83},"wind":{"speed":3.54,"deg":68,"gust":9.97},"visibility":10000,"pop":0.7,"rain":{"3h":0.24},"sys":{"pod":"d"},"dt_txt":"2023-06-11 18:00:00"},{"dt":1686517200,"main":{"temp":11.08,"feels_like":10.67,"temp_min":11.08,"temp_max":11.08,"pressure":1021,"sea_level":1021,"grnd_level":995,"humidity":93,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":79},"wind":{"speed":4.13,"deg":52,"gust":10.57},"visibility":10000,"pop":0.09,"sys":{"pod":"n"},"dt_txt":"2023-06-11 21:00:00"},{"dt":1686528000,"main":{"temp":10.37,"feels_like":9.73,"temp_min":10.37,"temp_max":10.37,"pressure":1021,"sea_level":1021,"grnd_level":994,"humidity":87,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":89},"wind":{"speed":4.08,"deg":45,"gust":8.71},"visibility":10000,"pop":0.12,"sys":{"pod":"n"},"dt_txt":"2023-06-12 00:00:00"},{"dt":1686538800,"main":{"temp":9.65,"feels_like":7.45,"temp_min":9.65,"temp_max":9.65,"pressure":1019,"sea_level":1019,"grnd_level":993,"humidity":94,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":4.27,"deg":30,"gust":8.65},"visibility":10000,"pop":0.42,"rain":{"3h":0.23},"sys":{"pod":"d"},"dt_txt":"2023-06-12 03:00:00"},{"dt":1686549600,"main":{"temp":9.6,"feels_like":7.67,"temp_min":9.6,"temp_max":9.6,"pressure":1019,"sea_level":1019,"grnd_level":992,"humidity":97,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":3.67,"deg":23,"gust":7.45},"visibility":10000,"pop":0.65,"rain":{"3h":0.36},"sys":{"pod":"d"},"dt_txt":"2023-06-12 06:00:00"},{"dt":1686560400,"main":{"temp":10.17,"feels_like":9.75,"temp_min":10.17,"temp_max":10.17,"pressure":1018,"sea_level":1018,"grnd_level":992,"humidity":96,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":3,"deg":24,"gust":5.29},"visibility":10000,"pop":0.87,"rain":{"3h":0.46},"sys":{"pod":"d"},"dt_txt":"2023-06-12 09:00:00"},{"dt":1686571200,"main":{"temp":11.2,"feels_like":10.75,"temp_min":11.2,"temp_max":11.2,"pressure":1018,"sea_level":1018,"grnd_level":991,"humidity":91,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":2.04,"deg":35,"gust":2.52},"visibility":10000,"pop":0.79,"rain":{"3h":0.36},"sys":{"pod":"d"},"dt_txt":"2023-06-12 12:00:00"},{"dt":1686582000,"main":{"temp":11.87,"feels_like":11.41,"temp_min":11.87,"temp_max":11.87,"pressure":1017,"sea_level":1017,"grnd_level":991,"humidity":88,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":1.15,"deg":26,"gust":1.33},"visibility":10000,"pop":0.25,"rain":{"3h":0.13},"sys":{"pod":"d"},"dt_txt":"2023-06-12 15:00:00"},{"dt":1686592800,"main":{"temp":11.76,"feels_like":11.37,"temp_min":11.76,"temp_max":11.76,"pressure":1017,"sea_level":1017,"grnd_level":991,"humidity":91,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":0.24,"deg":321,"gust":0.43},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-06-12 18:00:00"},{"dt":1686603600,"main":{"temp":9.04,"feels_like":9.04,"temp_min":9.04,"temp_max":9.04,"pressure":1017,"sea_level":1017,"grnd_level":991,"humidity":95,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":62},"wind":{"speed":1.28,"deg":91,"gust":1.36},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-06-12 21:00:00"},{"dt":1686614400,"main":{"temp":7.74,"feels_like":7.17,"temp_min":7.74,"temp_max":7.74,"pressure":1017,"sea_level":1017,"grnd_level":990,"humidity":96,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":31},"wind":{"speed":1.42,"deg":90,"gust":1.44},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-06-13 00:00:00"},{"dt":1686625200,"main":{"temp":7.4,"feels_like":6.42,"temp_min":7.4,"temp_max":7.4,"pressure":1016,"sea_level":1016,"grnd_level":990,"humidity":97,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":5},"wind":{"speed":1.74,"deg":93,"gust":1.84},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-06-13 03:00:00"},{"dt":1686636000,"main":{"temp":12.78,"feels_like":12.36,"temp_min":12.78,"temp_max":12.78,"pressure":1016,"sea_level":1016,"grnd_level":990,"humidity":86,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":11},"wind":{"speed":2.77,"deg":95,"gust":3.59},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-06-13 06:00:00"},{"dt":1686646800,"main":{"temp":18.29,"feels_like":17.95,"temp_min":18.29,"temp_max":18.29,"pressure":1015,"sea_level":1015,"grnd_level":989,"humidity":68,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":65},"wind":{"speed":3.01,"deg":100,"gust":3.63},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-06-13 09:00:00"},{"dt":1686657600,"main":{"temp":21.34,"feels_like":21.15,"temp_min":21.34,"temp_max":21.34,"pressure":1014,"sea_level":1014,"grnd_level":988,"humidity":62,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":54},"wind":{"speed":4.12,"deg":63,"gust":4.04},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-06-13 12:00:00"},{"dt":1686668400,"main":{"temp":19.27,"feels_like":19.34,"temp_min":19.27,"temp_max":19.27,"pressure":1014,"sea_level":1014,"grnd_level":988,"humidity":80,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":98},"wind":{"speed":5.33,"deg":71,"gust":7.71},"visibility":10000,"pop":0.58,"rain":{"3h":0.49},"sys":{"pod":"d"},"dt_txt":"2023-06-13 15:00:00"}],"city":{"id":3085041,"name":"Śródmieście","coord":{"lat":50.0619,"lon":19.9369},"country":"PL","population":0,"timezone":7200,"sunrise":1686191531,"sunset":1686249992}}}}
    data.payload.current.dt = now
    data.payload.forecast.list = data.payload.forecast.list.map((row, i) => {
      const dt = Math.floor((now + 3*60*60*(i+1))/3600)*3600
      return {
        ...row,
        dt,
        dt_txt: new Date(dt*1000).toISOString()
      }
    })
    return data
  }
  
  _getConfig() {
    return {
      widgets: {
        dateTime: {
          countdown: {
            name: "Vacations",
            date: new Date(Math.floor((new Date().getTime()+17*24*60*60*1000)/(24*60*60*1000))*(24*60*60*1000)).toISOString()
          },
          timezones: [
            {
              id: "europe/warsaw",
              name: "Kraków"
            },
            {
              id: "america/new_york",
              name: "New York"
            },
            {
              id: "america/los_angeles",
              name: "Los Angeles"
            },
            {
              id: "asia/tokyo",
              name: "Tokyo"
            }
          ]
        }
      }
    }
  }

  on(eventName, callback) {
    if(!this._listeners[eventName]) {
      this._listeners[eventName] = []
    }
    this._listeners[eventName].push(callback)
  }

  emit(event, {serviceId, payload}) {
    if(serviceId === 'todo' && payload.action === "completeNextAction") {
      this._todoData.payload.action = this._todoData.payload.action.map(item => {
        if(item.id !== payload.id) {
          return item
        }
        return {
          ...item,
          status: "completed",
          completed: new Date().getTime()
        }
      })
      this._publish('widget', this._getTodoData())
    } else if(serviceId === 'todo' && payload.action === "uncompleteNextAction") {
      this._todoData.payload.action = this._todoData.payload.action.map(item => {
        if(item.id !== payload.id) {
          return item
        }
        return {
          ...item,
          status: "needsAction",
          completed: null
        }
      })
      this._publish('widget', this._getTodoData())
    } else if(serviceId === 'room' && payload.action === 'acMode' && payload.value ==='on') {
      this._roomData.payload.ac.state = 'cool'
      this._publish('widget', this._getRoomData())
    } else if(serviceId === 'room' && payload.action === 'acMode') {
      this._roomData.payload.ac.state = payload.value
      this._publish('widget', this._getRoomData())
    } else if(serviceId === 'room' && payload.action === 'fanMode') {
      this._roomData.payload.ac.attributes.fan_mode = payload.value
      this._publish('widget', this._getRoomData())
    } else if(serviceId === 'room' && payload.action === 'cover') {
      this._roomData.payload[payload.target].attributes.current_position = payload.value
      this._publish('widget', this._getRoomData())
    } else if(serviceId === 'pomodoro' && payload.action === 'pomodoroDone') {
      this._pomodoroData.payload.history.push(new Date().getTime())
      this._publish('widget', this._getPomodoroData())
    }
  }
}