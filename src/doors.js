const rest = require('rest');
const mime = require('rest/interceptor/mime');

const client = rest.wrap(mime);
module.exports = () => {
  const doorStatus = document.getElementById('door_status');
  return client({
    path: 'https://members.heatsynclabs.org/space_api.json',
  })
  .then((response) => {
    console.log('door response', response);
    const data = response.entity;
    const status_text = `<span class="${data.open ? 'open' : 'closed'}">
    ${data.open ? 'open, come on down!' : 'closed, check the calendar!'}
    </span>`;
    doorStatus.innerHTML = status_text;


    return data;
  })
  .catch((err) => {
    console.log('Did not get door data.', err);
    doorStatus.innerHTML = 'Error occurred while fetching status, please refresh.';
  })
  .then(() => {
    // temporary hack
    doorStatus.innerHTML = 'Check the Calendar';
  });
};
