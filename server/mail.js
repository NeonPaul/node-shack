const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'bvdlrevckprxajnl@ethereal.email',
      pass: 'qMQ6hu4QUyhZ6gJeax'
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
