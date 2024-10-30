app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    if (users[email]) {

      const token = crypto.randomBytes(20).toString('hex');
      users[email].resetToken = token;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-email-password',
        },
      });
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send('Error sending email');
        } else {
          console.log(`Email sent: ${info.response}`);
          res.status(200).send('Check your email for instructions on resetting your password');
        }
      });
    } else {
      res.status(404).send('Email not found');
    }
  });
  // Route to handle the reset token
  app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    // Check if the token exists and is still valid
    if (users.some(user => user.resetToken === token)) {
      // Render a form for the user to enter a new password
      res.send('<form method="post" action="/reset-password"><input type="password" name="password" required><input type="submit" value="Reset Password"></form>');
    } else {
      res.status(404).send('Invalid or expired token');
    }
  });
  // Route to update the password
  app.post('/reset-password', (req, res) => {
    const { token, password } = req.body;
    // Find the user with the given token and update their password
    const user = users.find(user => user.resetToken === token);
    if (user) {
      user.password = password;
      delete user.resetToken; // Remove the reset token after the password is updated
      res.status(200).send('Password updated successfully');
    } else {
      res.status(404).send('Invalid or expired token');
    }
  });