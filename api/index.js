/* eslint-disable no-console */
require('dotenv').config();
const fb = require('fbgraph');
const got = require('got');
const cron = require('node-cron');

module.exports = (req, res) => {
  fb.setAccessToken(process.env.APP_TOKEN);
  fb.setAppSecret(process.env.APP_SECRET_TOKEN);

  cron.schedule('* */1 * * *', async () => {
    try {
      const summary = await got('https://covid19.patria.org.ve/api/v1/summary').json();
      let today = await got('https://covid19.patria.org.ve/api/v1/timeline').json();
      today = today[today.length - 1];

      const post = {
        message:
          `Actualización ${today.Date}:

          Confirmados: ${summary.Confirmed.Count}
          Recuperados: ${summary.Recovered.Count}
          Muertos: ${summary.Deaths.Count}
          Siguen activos: ${summary.Active.Count}

          Hoy se han registrado ${today.Confirmed.New} nuevos casos, ${today.Recovered.New} pacientes recuperados y ${today.Deaths.New} muertos

          Más información en covidenvenezuela.com`,
      };

      fb.post('/feed', post, (err, response) => console.info(response));
    } catch (error) {
      console.log(error.response.body);
    }
  }, {
    scheduled: true,
    timezone: 'America/Caracas',
  });

  res.json({
    body: 'Hello world!',
  })
}
