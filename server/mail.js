const nodemailer = require('nodemailer');
const getenv = require('getenv');

const transport = nodemailer.createTransport({
  host: getenv('SMTP_HOST', 'smtp.ethereal.email'),
  port: getenv('SMTP_PORT', '587'),
  auth: {
    user: getenv('SMTP_USER', 'bvdlrevckprxajnl@ethereal.email'),
    pass: getenv('SMTP_PASS', 'qMQ6hu4QUyhZ6gJeax')
  }
});

module.exports = {
  send(options) {
    return new Promise((res, rej) => {
      transport.sendMail(options, (err, rtn) => {
        if(err) {
          rej(err);
        } else {
          res(rtn);
        }
      })
    })
  }
};
