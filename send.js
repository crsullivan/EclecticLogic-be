const router = require('express').Router();
const nodemailer = require('nodemailer');
require('dotenv').config()

var transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    auth: {
        type: 'OAuth2',
        user: process.env.USER,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        accessToken: process.env.ACCESSTOKEN,
        refreshToken: process.env.REFRESHTOKEN
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/', (req, res, next) => {
    console.log(process.env.USER)
    var name = req.body.name
    var address = req.body.address
    var email = req.body.email
    var content = `name: ${name} \n address: ${address} \n email: ${email} `
  
    var mail = {
      from: name,
      to: 'eclecticlogic.business@gmail.com',  // Change to email address that you want to receive messages on
      subject: 'New Message from Contact Form',
      text: content
    }
  
    transporter.sendMail(mail, (err, data) => {
        if (err) {
          res.json({
            status: 'failure sending email'
          })
        } else {
          res.json({
           status: 'success, email sent'
          })
          transporter.sendMail({
            from: "eclecticlogic.business@gmail.com",
            to: address,
            subject: "Submission was successful",
            text: `Thank you for contacting us!\n\nForm details\nName: ${name}\n Email: ${address}\n Message: ${email}`
          }, function(error, info){
            if(error) {
              console.log(error);
              console.log(address, 'but it failed')

            } else{
                console.log(address);
                console.log('Message sent: ' + info.response);
            }
          });
          
        }
      })
  })

  module.exports = router;
