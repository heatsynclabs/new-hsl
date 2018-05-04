const doors = require('./doors');

function refresh() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById('livestream' + i).src = `http://live.heatsynclabs.org/snapshot.php?camera=${i}&time=${new Date()}`;
    document.getElementById('lsAnchor' + i).href = `http://live.heatsynclabs.org/snapshot.php?camera=${i}&time=${new Date()}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setInterval(refresh, 10000);

  Promise.all([doors()])
    .then(console.log)
    .catch(console.error);
});
