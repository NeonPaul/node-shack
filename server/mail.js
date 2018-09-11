const nodemailer = require('nodemailer');
const getenv = require('getenv');

const transport = nodemailer.createTransport({
  host: getenv('SMTP_HOST', 'smtp.ethereal.email'),
  port: getenv('SMTP_PORT', '587'),
  auth: {
    user: getenv('SMTP_USER', 'brf3o63m5l5pqfkf@ethereal.email'),
    pass: getenv('SMTP_PASS', 'zxywmbdeCKacumvDmu')
  }
});

module.exports = {
  send(options) {
    options.from = `"Paul Kiddle" <paul@mrkiddle.co.uk>`

    if (options.to.email) {
      const name = options.to.user;
      options.to = name ? `"${name}" <${options.to.email}>` : options.to.email;
    }

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
