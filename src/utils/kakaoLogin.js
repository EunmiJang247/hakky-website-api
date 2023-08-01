const axios = require('axios');

const kakaoProfile = async (code) => {
  const restKey = process.env.KAKAO_REST_KEY;
  const secretKey = process.env.KAKAO_SECRET;
  try {
    const token = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {
        grant_type: 'authorization_code',
        client_id: restKey,
        redirect_uri: 'https://www.studio-seba.com/sign-in',
        code,
        client_secret: secretKey,
      },
    });
    const kakaoData = await axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${token.data.access_token}`,
      },
      data: {
        property_keys: ['kakao_account.name', 'kakao_account.email'],
      },
    });

    return kakaoData;
  } catch (error) {
    return 400;
  }
};

module.exports = {
  kakaoProfile,
};
