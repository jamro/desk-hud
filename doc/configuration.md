# Configuration

## Location

By default, the configuration file, `desk-hud-config.json` is read from the root directory of the project. However, if you wish to use an alternative location for the config file, you can set the environment variable `DHUD_CONFIG` to the desired file path. This allows for flexibility in specifying the location of the config file to suit your needs. 

To assist you in creating the config file, a template named `desk-hud-config.default.json` is provided within the project. You can refer to this template as a starting point to define your own configurations and customize Desk-HUD according to your preferences.

## Config parameters

The configuration for Desk-HUD is stored in a JSON file.

- **core**: This section contains core settings for Desk-HUD.
  - `port` (number): The port number on which Desk-HUD's server runs.
  - `distance` (object): The distance settings for the distance sensor, specifying the threshold values for waking up and going to sleep modes.
    - `wakeUp` (number): The distance threshold (in centimeters) at which Desk-HUD wakes up from sleep mode.
    - `goSleep` (number): The distance threshold (in centimeters) at which Desk-HUD goes into sleep mode.
  - `powerOffTime` (number): The duration in milliseconds after which Desk-HUD's monitor powers off.

- **dateTime**: This section handles date and time widget configuration
  - `countdown` (object): Specifies a countdown timer with a name and a target date.
    - `name` (string): The name of the countdown timer.
    - `date` (string): The target date for the countdown timer in ISO 8601 format.
  - `timezones` (array): Defines an array of time zones with their IDs and corresponding names.
    - Each timezone object has the following properties:
      - `id` (string): The ID of the time zone.
      - `name` (string): The corresponding name of the time zone.

- **weather**: This section includes settings for weather information.
  - `apiKey` (string): The API key required to access weather data.
  - `lat` (number): The latitude coordinate of the location for weather information.
  - `lon` (number): The longitude coordinate of the location for weather information.

- **hass**: This section pertains to Home Assistant integration.
  - `url` (string): The URL of the Home Assistant instance.
  - `token` (string): The authentication token for Home Assistant.
  - `entities` (object): Defines a mapping of entity names used in Desk-HUD
    - `temp` (string): The entity ID for the temperature sensor.
    - `tempBattery` (string): The entity ID for the temperature sensor battery status.
    - `ac` (string): The entity ID for the air conditioning system.
    - `door1`, `door2`, `door3` (string): The entity IDs for binary door sensors.
    - `cover1`, `cover2`, `cover3`, `cover4`, `cover5` (string): The entity IDs for window cover devices.
    - `door1Battery`, `door2Battery`, `door3Battery` (string): The entity IDs for the battery status of the door sensors.
    - `cover1Battery`, `cover2Battery`, `cover3Battery`, `cover4Battery`, `cover5Battery` (string): The entity IDs for the battery status of the window cover devices.

- **google**: This section pertains to Google integration.
  - `clientId` (string): The client ID for Google integration.
  - `clientSecret` (string): The client secret for Google integration.
  - `clientToken` (string): The client token for Google integration.
  - `tasks` (object): Contains settings related to Google Tasks integration.
    - `inboxId` (string): The ID of the Google Tasks inbox (see Getting Things Done technique).
    - `actionsId` (string): The ID of the Google Tasks actions list (see Getting Things Done technique).
  - `calendars` (array): An array of Google Calendars IDs.

- **stockdata** - allows you to configure the [StockData](http://www.stockdata.org) service integration for Desk-HUD. StockData provides financial market data and analytics.
  - `apiKey` (string): The API key for accessing the StockData service.
  - `symbol` (string): The stock symbol or ticker for which you want to fetch data. 


## Integrations

### Open Weather Maps

To obtain the weather.apiKey for Desk-HUD, you will need to sign up on the OpenWeatherMap website and obtain an API key. Here are the steps to get the API key:

1. Visit the [OpenWeatherMap website](https://openweathermap.org/).
2. Sign up for a free account or log in to your existing account.
3. Once logged in, navigate to the `My API Keys` section.
4. Generate a new API key by clicking on the "Generate" button.
5. Once the API key is generated, copy it to your clipboard.
6. Paste the API key into the `weather.apiKey` parameter in the Desk-HUD configuration file.

### Home Assistant

1. Log in to your Home Assistant instance.
2. Navigate to your user profile or user settings.
3. Locate the "Long-Lived Access Tokens" section.
4. Generate a new access token by clicking on the "Create Token" or similar button.
5. Provide a name for the token to identify its purpose (e.g., "Desk-HUD Integration").
6. Once the token is generated, copy it to your clipboard or save it in a secure location.
7. Paste the Home Assistant token into the corresponding `hass.token` parameter in the Desk-HUD configuration file.

### Google

To set up Google access keys for integration with Desk-HUD, follow these steps:

- In the Google Cloud console, go to Menu `APIs & Services` > `Credentials`.
- Click `Create Credentials` > `OAuth client ID`.
- Click `Application type` > `Desktop app`.
- In the `Name` field, type a name for the credential. This name is only shown in the Google Cloud console.
- Click `Create`. The OAuth client created screen appears, showing your new Client ID and Client secret.
- Click `OK`. The newly created credential appears under OAuth 2.0 Client IDs.
- Save the downloaded JSON file as `credentials.json`
- Open `OAuth consent screen` and yourself to `Test users`
- Once you have `credentials.json`, run the `node ./google_auth.js` script. Follow the instructions provided to complete the authentication process.

Detailed process of obtaining `credentials.json` is described here [here](https://developers.google.com/tasks/quickstart/nodejs)

** Refreshing Access Token **
If your access token has expired, you need to remove `clientSecret` and `clientToken` from `deck-hud-config.json` and rerun `node ./google_auth.js` script.

### StockData

- Visit the StockData website: Go to the StockData website at http://www.stockdata.org.
- Click "Sign In"
- Crete an account
- Get API token and copy it to config file