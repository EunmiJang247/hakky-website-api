const axios = require('axios');

const naverProfile = async (naverToken) => {
  try {
    const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${naverToken}`,
      },
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

module.exports = naverProfile;
