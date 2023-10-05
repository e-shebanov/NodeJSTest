const axios = require('axios');


const client_id = '87f1ad01-e2c2-406c-9555-5c2e7d4ab562';
const client_secret = 'bffNPYJdu6aGNk8rJvcZqN3ha8VdrbqqsF8tTugf1rKvWXae2UNrHRmfYDIQIUkO';
const authorization_code = 'def50200861868d50158d0b97655e6e2616b7b1e7abd04e3e1872f32fc13c21da47b443a35fa680e57d81fa5b5097eaacbbf4a37dd54db1f8e5b5d561a40388b3b28b1162958b74da084f6385d30c1d27b0a0eb1dcfa120bcfd3098feb848e613c1ebf28984ec0b68a54ef9a7d19871800472b70a5bd2a9d73c3ce610b2fbea112bb4a8028972424a811673b2d8d231ad2b8650b8ca390203f5bcd02033ee063fd8e3b01f14eec99ab3e923c854b7cbd50673a0e6364a0ebf7c8d63f22dcce4077340d41bb6c99ed4f928db4798d93d718f49946cf0a15ed82f28ed99ca9a9136933ce353cfe7b84ef3ac4ed63aba815ceb07c6bdcabe2fd3c5c162e807df64db3c8ce8f5e490d60a4c07a0ba5e0292acf799647e33de5eccc5b4d7e8fa80d6c517ba5544248395c21fce0bdb6eeb32e1faae660a742af3689ae8c6fc55f74df39f6e6e2b5a1701f42f7bb50f30ac0a89b5fbaaa2a8d78f11c626b4057ab0f5558d97d273cd103d73cfdc5829bef87f87c545b077659ca88884671631073987d8adc34a4cb71a26f59dcc3016814b6166dc294126c845fae046dae02273f3d441498c48811b1dac569b4aa4d2f8d01a52c8d3b4749e0ff1248a205727fc9543dea839a5530a59a02c63cc0609808f136c80a0dc25349c9991a82c1bf4090f2f7aafa2af96d63d0c6b64eb4847d441e1efe9a5973efb91fb6d66482';
const redirect_uri = 'https://1974-94-51-52-151.ngrok-free.app/';


const requestData = {
  client_id,
  client_secret,
  grant_type: 'authorization_code',
  code: authorization_code,
  redirect_uri,
};


axios
  .post('https://shebanove.amocrm.ru/oauth2/access_token', requestData)
  .then((response) => {

    const { access_token, refresh_token, expires_in } = response.data;

    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Expires In (seconds):', expires_in);
  })
  .catch((error) => {

    console.error('Ошибка при обмене кода авторизации на токены:', error.message);
  });
