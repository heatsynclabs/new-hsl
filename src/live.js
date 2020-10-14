const doors = require('./doors');

function refresh() {
  for (let i = 1; i <= 4; i++) {
    const url = `https://live.heatsynclabs.org/snapshot.php?camera=${i}&time=${Date.now()}`;
    const img = new Image();
    img.onload = () => {
      document.getElementById('livestream' + i).src = url;
      document.getElementById('lsAnchor' + i).href = url;
    };
    img.src = url;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setInterval(refresh, 10000);

  Promise.all([doors()])
    .then(console.log)
    .catch(console.error);
});
