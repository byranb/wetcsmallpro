const { apiUrl } = require('../config/index.js');
const req = require('../utils/mp-req/index.js');
// api
const userApi = require('./api/user.js');

/**
 * code换取sessionId
 * @param {string} code
 */
function code2sessionId(code) {
  return new Promise((res, rej) => {
    wx.request({
      url: `${apiUrl}/smallprogram/code2Session`,
      data: {
        jsCode:code
      },
      method: 'POST',
      success(r1) {
        console.log('code2Session success', r1);
        if (r1.data.code === 0) {
          res(r1);
        } else {
          rej(r1);
        }
      },
      fail: rej,
    });
  });
}

/**
 * 检查session是否有效
 * @param {any} res
 */
function isSessionAvailable(res) {
  return res.code !== "9999";
  // return isJSON(JSON.stringify(res));
}

function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        console.log('It is a json!')
        return true;
      } else {
        console.log('It is not a json!')
        return false;
      }

    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
  console.log('It is not a string!')
}

req.init({
  apiUrl,
  code2sessionId,
  isSessionAvailable,
});

req.use(userApi);

module.exports = req;
