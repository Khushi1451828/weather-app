 
const API_KEY = '36ecb23fa017877e689121972b78de5a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getWeatherData = (infoType,searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid:API_KEY}
    );
   console.log(url);
    return fetch(url).then((res) => res.json())
    // .then((data) => data);
    
};
const formatCurrentWeather = (data) => {
const {
  coord: {lat,lon},
  main: {temp, feels_like, temp_min, temp_max, humidity},
  name,
  dt,
  sys:{country,sunrise,sunset},
  weather,
  wind:{speed}
} = data
const {main: details,icon}=weather[0]
return {lat,lon,temp,feels_like,temp_min,temp_max,humidity,name,dt,country,sunrise,sunset,details,icon,weather,speed}
}

const FormatForecastWeather = (data) =>{
  let { timezone, daily, hourly} = data;
  daily = daily.slice(1,6).map((d) => {
    return {
      title: formatToLocalTime(d.dt,timezone,'ccc'),
      temp:d.temp.day,
      icon:d.weather[0].icon
    }
  });
  hourly = hourly.slice(1,6).map(d => {
    return {
      title: formatToLocalTime(d.dt,timezone,'hh:mm a'),
      temp:d.temp,
      icon:d.weather[0].icon
    }
  });
  return {timezone,daily,hourly};
};
const getFormattedWeatherData =  async (searchParams) =>
{
  const FormattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
    ).then(formatCurrentWeather)
    const {lat,lon} = FormattedCurrentWeather

    const FormattedForecastWeather = await getWeatherData("onecall",{
      lat,
      lon,
      exclude:'current,minutely,alerts',
      units: searchParams.units,
    }).then(FormatForecastWeather);
      return { ...FormattedCurrentWeather , ...FormattedForecastWeather}
};
const formatToLocalTime = (
  secs,zone,format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`
export default getFormattedWeatherData;
export {formatToLocalTime, iconUrlFromCode};