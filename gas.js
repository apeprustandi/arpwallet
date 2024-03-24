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

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const fakeIpIndonesia = () => {
  const firstOctet = Math.floor(Math.random() * 256);
  const secondOctet = Math.floor(Math.random() * 256);
  const thirdOctet = Math.floor(Math.random() * 256);
  const fourthOctet = Math.floor(Math.random() * 256);
  return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
};

const countdownAndWithdraw = async (jumlah) => {
  const printCountdown = remainingTime => {
    process.stdout.write(`${Math.floor(remainingTime / 60)} menit ${remainingTime % 60} detik\r`);
  };
  let remainingTime = jumlah; //dalam detik
  const intervalId = setInterval(async () => {
    remainingTime--;
    printCountdown(remainingTime);
    if (remainingTime === 0) {
      clearInterval(intervalId);
    }
  }, 1000); // Update setiap 1 detik
  await new Promise(resolve => setTimeout(resolve, remainingTime * 1000)); // menunggu sampai hitung mundur selesai
};


const apiFaker = async () => {
  const akunIp = await fakeIpIndonesia();
  return new Promise((resolve, reject) => {
    fetch("https://api.suhu.my.id/v2/faker", {
      headers: {
        "X-Forwarded-For": akunIp,
        "X-Real-IP": akunIp,
        "X_REAL_IP": akunIp,
        "HTTP_X_FORWARDED_FOR": akunIp
      }
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });
};


const bikinFile = async (noAkun, email, username, myCookie, wallet, tag, userAgent, namaFile) => {
    const suksesAccount = {
      akun:noAkun,
      email,
      username,
      myCookie,
      wallet,
      tag,
      userAgent,
    };
    
    const existingData = await fs.promises.readFile(namaFile, 'utf-8').catch(() => "[]");
    let parsedData;
    try {
      parsedData = JSON.parse(existingData);
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      parsedData = [];
    }
    parsedData.push(suksesAccount);
    const suksesJSON = JSON.stringify(parsedData, null, 2);
    await fs.promises.writeFile(namaFile, suksesJSON).catch(err => console.error('Error writing to file:', err));
  }  

const register = (userAgent, username, email, nama) => {
    return new Promise((resolve, reject) => {
        fetch('https://api.arpwallet.com/api/user/register', {
            method: 'POST',
            headers: {
              'authorization': 'Bearer undefined',
              'content-type': 'text/plain;charset=UTF-8',
              'user-agent': userAgent
            },
            body: JSON.stringify({
                "username":username,
                "email":email,
                "fname":nama,
                "cy":"IDR",
                "password":"ApRi191099",
                "r":""
            })
          })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const setCookieHeader = res.headers.get('Set-Cookie');
        return res.text().then((data) => {
          resolve({ data, setCookieHeader });
        });
      })
      .catch((err) => {
        reject(err);
      });
    });
  };

const aktivasi = (myCookie, userAgent) => {
    return new Promise((resolve, reject) => {
        fetch('https://api.arpwallet.com/api/user/activate', {
            method: 'POST',
            headers: {
              'authorization': `Bearer ${myCookie}`,
              'content-type': 'text/plain;charset=UTF-8',
              'user-agent': userAgent
            },
            body: '{}'
          })
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

const withdraw = (myCookie, userAgent, tag, wallet, rotatorProxyUrl) => {
  return new Promise((resolve, reject) => {
    fetch('https://api.arpwallet.com/api/user/withdraw_xrp', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${myCookie}`,
        'content-type': 'text/plain;charset=UTF-8',
        'user-agent': userAgent
      },
      body: JSON.stringify({
        "vericode":"025l7IO47861A3369Q552468D98",
        "memotag":tag,
        "address":wallet,
        "amount":"0.000027"
      }),
      agent: new HttpsProxyAgent(rotatorProxyUrl)
    })
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
  console.clear()
  let type;
  while (true) {
    console.log("Pilih Menu");
    console.log("[1] Register");
    console.log("[2] Withdraw");

    const choice = readlineSync.questionInt('Masukkan pilihan Anda: ');
    console.log('')
    
    if (choice === 1) {
      type = 'reg';
      break;
    } else if (choice === 2) {
      type = 'wd';
      break;
    }
  }

  if(type == 'reg'){
      while(true){
        const totalAkun = await fs.promises.readFile(`akun.json`, 'utf8');
        const dataAkun = JSON.parse(totalAkun);
        const bacaWalet = await fs.promises.readFile(`wallete.json`, 'utf8');
        const walletJSON = JSON.parse(bacaWalet);
          try {
            // const rotatorProxyUrl = await acakUrlProxy(rotatorProxyUrls)
            const str = await generateRandomString(5)
            const dataFake = await apiFaker();
            const userAgent = dataFake.browser.user_agent;
            const username = `${dataFake.username}${str}`;
            const nama = `${dataFake.nama}${str}`;
            const email = `${dataFake.email}`;
            const wallet = walletJSON[dataAkun.length].alamat
            const tag = walletJSON[dataAkun.length].tag
            const noAkun = dataAkun.length; 
            console.log(`No        : ${noAkun}`);
            console.log(`Email     : ${email}`);
            console.log(`Wallete   : ${wallet}`);
            console.log(`Tag       : ${tag}`);

            const hasilReg = await register(userAgent, username, email, nama)
            if(hasilReg.data.includes('Registration successful')){
              const myCookie = hasilReg.setCookieHeader.split('token=')[1].split(',')[0]
              const gasAktivasi = await aktivasi(myCookie, userAgent)
              if(gasAktivasi.includes('dashboard.html')){
                console.log(`Daftar    : Berhasil`);
                await bikinFile(noAkun, email, username, myCookie, wallet, tag, userAgent, 'akun.json')
              }else{
                    console.log(`Daftar    : ${gasAktivasi}`);
              }
            }
            console.log(" ")
          } catch (error) {
            console.log(error)
          }
      }
    }

    if(type == 'wd'){
      const fileAkun = `akun.json`
      if (!fs.existsSync(fileAkun)) {
        console.log(`File ${fileAkun} tidak ditemukan.`);
        process.exit(0)
      }else{
        const totalAkun = await fs.promises.readFile(fileAkun, 'utf8');
        const dataAkun = JSON.parse(totalAkun);
        console.log(`Total     : ${dataAkun.length} Akun`);
      }
      console.log('')
      const mulai1 = readlineSync.questionInt('Mulai akun berapa: ');
      const stop2 = readlineSync.questionInt('Stop akun berapa: ');
      
      while(true){
        const totalAkun = await fs.promises.readFile(fileAkun, 'utf8');
        const dataAkun = JSON.parse(totalAkun);
        console.log(" ");
        const mulai = mulai1 -1
        const stop = stop2
        for (let i = mulai; i < stop && i < dataAkun.length; i++) {
          const user = dataAkun[i];
          try {
            const rotatorProxyUrl = await acakUrlProxy(rotatorProxyUrls)
            const userAgent = user.userAgent;
            const username = user.username;
            const wallet = user.wallet;
            const tag = user.tag;
            const myCookie = user.myCookie
            console.log(`Akun ke   : ${i}`);
            console.log(`Username  : ${username}`);
            console.log(`Tag       : ${tag}`);
      
            const gasWd = await withdraw(myCookie, userAgent, tag, wallet, rotatorProxyUrl)
            if(gasWd.includes('Your withdrawal request is created')){
              console.log(`Withdraw  : 0.000024 XRP`);
            }else if(gasWd.includes('1 minute')){
              console.log(`Withdraw  : Belum 1 Menit`);
            }else{
              console.log(`Withdraw  : ${gasWd}`);
            }
          } catch (error) {
            console.log(`Error     : ${error}`);
          }
          console.log(" ")
        }
        await countdownAndWithdraw(1);
      }
    }

})();
