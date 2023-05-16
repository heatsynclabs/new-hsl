window.doors = () => {
  const doorStatus = document.getElementById('door_status');
  return fetch('https://members.heatsynclabs.org/space_api.json')
    .then(resp => resp.json())
    .then((data) => {
      console.log('door response', data);
      const status_text = `<span class="${data.open ? 'open' : 'closed'}">
      ${data.open ? 'open, come on down!' : 'closed, check the calendar!'}
      </span>`;
      doorStatus.innerHTML = status_text;
      return data;
    })
    .catch((err) => {
      console.log('Did not get door data.', err);
      doorStatus.innerHTML = 'Error occurred while fetching status, please refresh.';
    });
};
