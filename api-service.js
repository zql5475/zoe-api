const axios = require('axios');
const config = require('config');
const pg = require('pg');
const client = new pg.Client('postgres://zoe:zoe@localhost:5432/postgres');
client.connect();


module.exports = {
    login: async () => {
        const result = await axios.get(`https://github.com/login/oauth/authorize?client_id=${config.get('APP_CLIENT_ID')}&redirect_uri=${config.get('APP_REDIRECT_URI')}`);
        if (result.status === 200 && result.config && result.config.url) {
            return result.config.url;
        } else {
            throw new Error();
        } 
    },

    getGithubAccessCode: async (code) => {
        const result = await axios.post(`https://github.com/login/oauth/access_token`, {
            client_id: config.get('APP_CLIENT_ID'),
            client_secret: config.get('APP_CLIENT_SECRET'),
            code: code,
        }, {
            headers: {'Accept': 'application/json'},
        });
        if (result.status === 200 && result.data && result.data.access_token) {
            return result.data.access_token;
        } else {
            throw new Error();
        }
    },

    getStarredRepoList: async (accessCode, hasStored, userId) => {
        const result = await axios.get(`https://api.github.com/user/starred`, {
            headers: {'Authorization': `token ${accessCode}`}
        });
        if (result.status === 200 && result.data && Array.isArray(result.data)) {
            if (!hasStored) {
                result.data.map(async (el) => {
                    await client.query(`DELETE FROM repositories WHERE user_id = $1`, [userId]);
                    await client.query(`INSERT INTO repositories (id, user_id, name, license_name, created_at, watchers_count, language, description) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
                        el.id,
                        userId,
                        el.name,
                        el.license.name,
                        el.created_at,
                        el.watchers_count,
                        el.language,
                        el.description,
                    ]);
                });
            }
            return result.data;
        } else {
            throw new Error();
        } 
    },

    getUserInformation: async (accessCode) => {
        const result = await axios.get(`https://api.github.com/user`, {
            headers: {'Authorization': `token ${accessCode}`}
        });
        if (result.status === 200 && result.data && result.data.id) {
            return result.data;
        } else {
            throw new Error();
        } 
    },

    searchRepositories: async (searchKey, accessCode) => {
        const result = await axios.get(`https://api.github.com/search/repositories?q=${searchKey}`, {
            headers: {'Authorization': `token ${accessCode}`}
        });
        if (result.status === 200 && result.data && result.data.items) {
            return result.data.items;
        } else {
            throw new Error();
        } 
    },

    getRepositories: async (userId) => {
        const result = await client.query('SELECT * FROM repositories WHERE user_id = $1', [userId])
        if (result && result.rows) {
            return result.rows;
        } else {
            throw new Error();
        } 
    },
};