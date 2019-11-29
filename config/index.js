const apiUrlTable = require('./apiUrlTable.js');

const apiUrl = apiUrlTable.release;

const shareData = {
  title: '车主云微ETC',
  path: '/pages/index/index'
};

module.exports = {
  // 环境
  apiUrl,
  // 分享内容
  shareData,
};
