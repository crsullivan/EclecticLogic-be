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
    var email = req.body.email
    var message = req.body.message
    var content = `name: ${name} \n email: ${email} \n message: ${message} `
  
    var mail = {
      from: name,
      to: 'eclecticlogic.business@gmail.com',  // Change to message email that you want to receive messages on
      subject: 'New Message from Contact Form',
      text: content
    }
  
    transporter.sendMail(mail, (err, data) => {
        if (err) {
          res.json({
            status: 'failure sending message'
          })
        } else {
          res.json({
           status: 'success, message sent'
          })
          transporter.sendMail({
            from: "eclecticlogic.business@gmail.com",
            to: email,
            subject: "Submission was successful",
            text: `Thank you for contacting us!\n\nForm details\nName: ${name}\n Email: ${email}\n Message: ${message}`
          }, function(error, info){
            if(error) {
              console.log(error);
              console.log(email, 'but it failed')

            } else{
                console.log(email);
                console.log('Message sent: ' + info.response);
            }
          });
          
        }
      })
  })

  module.exports = router;
