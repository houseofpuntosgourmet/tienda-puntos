const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

module.exports = async (req, res) => {
  try {
    const path = req.url.replace('/api', '');
    const url = `${BACKEND_URL}/api${path}`;

    const config = {
      method: req.method,
      url,
      headers: {
        ...req.headers,
        host: undefined,
      },
      data: req.body,
    };

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.message,
      error: error.response?.data,
    });
  }
};
