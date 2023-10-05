const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');


app.use(express.json());


app.get('/', async (req, res) => {
  try {
    const { name, email, phone } = req.query;

    const currentRefreshToken = readRefreshToken();

    if (!currentRefreshToken) {
      console.error('Refresh token не найден в файле.');
      return res.status(500).json({ success: false, message: 'Refresh token не найден' });
    }

    const clientId = '87f1ad01-e2c2-406c-9555-5c2e7d4ab562';
    const clientSecret = 'bffNPYJdu6aGNk8rJvcZqN3ha8VdrbqqsF8tTugf1rKvWXae2UNrHRmfYDIQIUkO';
    const subdomain = "shebanove";

  
    const requestData = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: currentRefreshToken,
      redirect_uri: 'https://1974-94-51-52-151.ngrok-free.app/', 
    };

    const response = await axios.post('https://www.amocrm.ru/oauth2/access_token', requestData);
    const bearerToken = response.data.access_token;

   
    writeRefreshToken(response.data.refresh_token);

  
    const contactResponse = await axios.get(`https://${subdomain}.amocrm.ru/api/v4/contacts?query=${email}&query=${phone}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });


    const emailContactResponse = await axios.get(`https://${subdomain}.amocrm.ru/api/v4/contacts?query=${email}`, {
  headers: {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  },
});


const phoneContactResponse = await axios.get(`https://${subdomain}.amocrm.ru/api/v4/contacts?query=${phone}`, {
  headers: {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  },
});

let contactId = null;

if (
  emailContactResponse.data &&
  emailContactResponse.data._embedded &&
  emailContactResponse.data._embedded.contacts.length > 0
) {

  contactId = emailContactResponse.data._embedded.contacts[0].id;
} else if (
  phoneContactResponse.data &&
  phoneContactResponse.data._embedded &&
  phoneContactResponse.data._embedded.contacts.length > 0
) {

  contactId = phoneContactResponse.data._embedded.contacts[0].id;
}

if (contactId) {

  const updateContact = {
    first_name: name,
    custom_fields_values: [
      {
        field_id: 63751, 
        values: [{ value: phone, enum_code: 'WORK' }],
      },
      {
        field_id: 63753, 
        values: [{ value: email, enum_code: 'WORK' }],
      },
    ],
  };

  await axios.patch(`https://${subdomain}.amocrm.ru/api/v4/contacts/${contactId}`, updateContact, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });
} else {

  const newContact = {
    first_name: name,
    custom_fields_values: [
      {
        field_id: 63751, 
        values: [{ value: phone, enum_code: 'WORK' }],
      },
      {
        field_id: 63753,
        values: [{ value: email, enum_code: 'WORK' }],
      },
    ],
  };

  const createContactResponse = await axios.post(`https://${subdomain}.amocrm.ru/api/v4/contacts`, [newContact], {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });

  contactId = createContactResponse.data._embedded.contacts[0].id;


  const newDeal = {
    name: 'Новая сделка',
    _embedded: {
      contacts: [
        {
          id: contactId,
        },
      ],
    },
  };

  const createDealResponse = await axios.post(`https://${subdomain}.amocrm.ru/api/v4/leads`, [newDeal], {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });

  const dealId = createDealResponse.data._embedded.leads[0].id;
    }
  
    res.status(200).json({ success: true, message: 'Действие выполнено успешно', contactId });
  } catch (error) {
    if (error.response) {
      console.log('status:', error.response.status);
      console.log('statusText:', error.response.statusText);
      console.log('headers:', error.response.headers);
      console.log('config:', error.config);
      console.log('request:', error.request);
      console.log('data:', error.response.data);
    }

    console.error('Ошибка при выполнении действия:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Произошла ошибка' });
  }
});





const refreshTokenFilePath = './refreshToken.json';

function readRefreshToken() {
  try{
    const tokenData = fs.readFileSync(refreshTokenFilePath, 'utf8');
    return JSON.parse(tokenData);
  }
    catch{
      return null;
    }
   
  }


// Функция для записи refresh token в файл
function writeRefreshToken(token) {
  const tokenData = JSON.stringify(token);
  fs.writeFileSync(refreshTokenFilePath, tokenData, 'utf8');
}


app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
