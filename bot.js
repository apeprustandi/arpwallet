const fetch = require('node-fetch');
const fs = require('fs');
const readlineSync = require("readline-sync");
const { HttpsProxyAgent } = require('https-proxy-agent');

const rotatorProxyUrls = [
  'http://duniakedol-rotate:ApRi191099@p.webshare.io:80/',
  'http://duniakedol2-rotate:ApRi191099@p.webshare.io:80/'
];

function acakUrlProxy(array) {
  const indeksAcak = Math.floor(Math.random() * array.length);
  return array[indeksAcak];
}

const register = (rotatorProxyUrl) => {
  return new Promise((resolve, reject) => {
    fetch('https://api.arpwallet.com/api/user/withdraw_xrp', {
      method: 'POST',
      headers: {
        'authority': 'api.arpwallet.com',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcnB3YWxsZXQiLCJhdWQiOiJzdWRhcm1hZGk2NiIsImlhdCI6MTcxMTI4OTY2MiwibmJmIjoxNzExMjg5NjYyLCJleHAiOjE3MTM4ODE2NjIsImRhdGEiOnsidXNlcmlkIjo2MzYxMzA4LCJlbWFpbCI6InN1ZGFybWFkaTY2QGdtYWlsLmNvbSIsImlwIjoiMjAwMTo0NDhhOjMwNDA6NWIxNjo3NGFiOmFiOTY6NzlkYTo2YzAxIn19.xa3HxjfSI_OD8TM1VIjAhPONVp5aAC4M70xhGRYTY1g',
        'content-type': 'text/plain;charset=UTF-8',
        'origin': 'https://arpwallet.com',
        'referer': 'https://arpwallet.com/',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      body: '{"vericode":"025l7IO47861A3369Q552468D98","memotag":"240850250","address":"rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg","amount":"0.000027"}'
    })
      // agent: new HttpsProxyAgent(rotatorProxyUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.text();
    })
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

(async () => {
  while(true){
    const rotatorProxyUrl = await acakUrlProxy(rotatorProxyUrls)
    const hasil = await register(rotatorProxyUrl)
    if(hasil.includes('Your withdrawal request is created')){
      console.log('Berhasil Menarik')
    } else {
      await delay(58000); // Tunggu selama 58 detik sebelum iterasi berikutnya
    }
  }
})();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
