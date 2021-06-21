const router = require('express').Router({mergeParams: true});
const apiService = require('./api-service');

router.get('/login', async (req, res) => {
    try {
        const url = await apiService.login();
        res.status(200).json({url: url}); 
    } catch (error) {
        res.status(500).json({message: 'Authorizing GitHub fail'});
    }
});

router.post('/access-code', async (req, res) => {
    try {
        const {code: code} = req.body;
        const accessCode = await apiService.getGithubAccessCode(code);
        res.status(200).json({access_code: accessCode}); 
    } catch (error) {
        res.status(500).json({message: 'Failed to get access code'});
    }
});

router.post('/starred', async (req, res) => {
    try {
        const {access_code : accessCode, has_stored: hasStored, user_id: userId} = req.body;
        const list = await apiService.getStarredRepoList(accessCode, hasStored, userId);
        res.status(200).json(list); 
    } catch (error) {
        res.status(500).json({message: 'Failed to get starred repositories'});
    }
});

router.post('/user', async (req, res) => {
    try {
        const {access_code : accessCode} = req.body;
        const user = await apiService.getUserInformation(accessCode);
        res.status(200).json(user); 
    } catch (error) {
        res.status(500).json({message: 'Failed to get user information'});
    }
});

router.post('/search', async (req, res) => {
    try {
        const {search_key: searchKey, access_code: accessCode} = req.body;
        const list = await apiService.searchRepositories(searchKey, accessCode);
        res.status(200).json(list); 
    } catch (error) {
        res.status(500).json({message: 'Failed to search repositories'});
    }
});

router.post('/repositories', async (req, res) => {
    try {
        const {user_id: userId} = req.body;
        const repositories = await apiService.getRepositories(userId);
        res.status(200).json(repositories); 
    } catch (error) {
        res.status(500).json({message: 'Failed to get repositories'});
    }
});

module.exports = router;