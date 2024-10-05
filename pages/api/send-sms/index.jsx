import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    console.log("API ÇALIŞTI")

    try {
      // 1. Token almak için kimlik doğrulama isteği
      const authResponse = await axios.post(
        'https://api.prod.us.five9.net/cloudauthsvcs/v1/token',
        'grant_type=client_credentials',
        {
          auth: {
            username: process.env.CLIENT_ID,
            password: process.env.CLIENT_SECRET,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token } = authResponse.data;

      // 2. SMS gönderme isteği
      const smsResponse = await axios.post(
        `https://api.prod.us.five9.net/send-sms-svc/v1/domains/${process.env.DOMAIN_ID}/send-sms-tasks`,
        {
          campaignName: "SMS OB Campaign",  // Doğru kampanya adını buraya ekleyin
          dispositionName: "SMS-closed",
          message: message || "SMS sent via API",
          attributes: {
            timestamp: "Time 1",
          },
          recipients: [
            {
              toPhoneNumber: "+14807217451",
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            'Client-id': process.env.CLIENT_ID,
            'Client-Secret': process.env.CLIENT_SECRET,
          },
        }
      );

      // Başarılı SMS gönderimi
      res.status(200).json(smsResponse.data);
    } catch (error) {
      // Hata durumunda yanıt döndürme
      console.error('Error sending SMS:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    // Yanlış HTTP methodu
    res.status(405).json({ message: 'Method not allowed' });
  }
}
