import path from 'path';
import axios from 'axios';
import fs from 'fs-extra';
import logger from 'consola';

export default function (options) {
    this.nuxt.hook('ready', async generator => {
        const body = 'grant_type=client_credentials';

        const { data } = await axios.post('https://accounts.spotify.com/api/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: '26a0181d60cb4cd7a616d5d028eb6aa3',
                password: this.nuxt.options.privateRuntimeConfig.spotifySecret
            }
        });
        const token = data.access_token;

        let tracks = [];

        try {
            const playlist = await axios.get('https://api.spotify.com/v1/playlists/1lMang7eAN5NJs2qoq8bYk/tracks', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            tracks = playlist.data.items
                .filter(track => track.track.preview_url)
                .map(track => {
                    return {
                        uri: track.track.uri,
                        url: track.track.preview_url,
                        name: track.track.name,
                        img: track.track.album.images[0],
                        artist: track.track.artists[0].name
                    };
                })
                .filter(track => track.url);
        } catch (error) {
            logger.error(error.response);
        }

        const filePath = path.join('app', 'tracks.json');
        fs.ensureFileSync(filePath);

        const staticFilePath = path.join('static', 'tracks.json');
        fs.ensureFileSync(staticFilePath);

        await fs
            .writeJSON(filePath, tracks)
            .then(() => {
                logger.success('Tracks successfully extracted');
            })
            .catch(err => {
                logger.error('Error writing tracks file', err);
            });

        await fs
            .writeJSON(staticFilePath, tracks)
            .then(() => {
                logger.success('Tracks successfully extracted');
            })
            .catch(err => {
                logger.error('Error writing tracks file', err);
            });
    });
}
