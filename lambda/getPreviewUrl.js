require('dotenv').config();
const axios = require('axios');
exports.handler = async function (event, context, callback) {
    const body = 'grant_type=client_credentials';

    const { data } = await axios.post('https://accounts.spotify.com/api/token', body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: '26a0181d60cb4cd7a616d5d028eb6aa3',
            password: process.env.SPOTIFY_SECRET
        }
    });

    const token = data.access_token;

    try {
        const track = await axios.get(
            `https://api.spotify.com/v1/tracks/${event.queryStringParameters.id.split(':')[2]}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        let res;

        if (track.data.preview_url) {
            res = `✅ ${track.data.artists[0].name} - ${track.data.name} a une preview ✅`;
        } else {
            res = `❌ ${track.data.artists[0].name} - ${track.data.name} ne possède pas de preview ❌`;
        }

        callback(null, {
            statusCode: 200,
            headers: {
                'Content-type': 'application/json'
            },
            body: res
        });
    } catch (error) {
        callback(null, {
            statusCode: 200,
            headers: {
                'Content-type': 'application/json'
            },
            body: "Verifie que l'ID est bon, il n'y a pas de morceau avec cet ID"
        });
    }
};
