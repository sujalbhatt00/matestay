const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

test('hello world!', async () => {
    const msg = {
        to: 'test@example.com',
        from: 'test@example.com',
        subject: 'Hello World',
        text: 'Hello, this is a test email!',
    };

    await expect(sgMail.send(msg)).resolves.not.toThrow();
});