import * as fs from 'fs';
import * as path from 'path';
import config from '../config';
import { IEmailOptions } from '../interfaces/email.interfaces';
import { errorLogger } from '../shared/logger';
const MailComposer = require('nodemailer/lib/mail-composer');
const { google } = require('googleapis');
const Util = require('util');
const ReadFile = Util.promisify(fs.readFile);
const Handlebars = require('handlebars');

const getGmailService = () => {
  const { clientId, clientSecret } = config.mail.gmail;
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials(config.mail.gmail.tokens);
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  return gmail;
};

const encodeMessage = (message: string) => {
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const createMail = async (options: IEmailOptions) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendEmail = async (options: IEmailOptions) => {
  try {
    const mailOptions: IEmailOptions = {
      to: options.to,
      cc: options.cc,
      replyTo: options.replyTo || 'zahid-hasan@programming-hero.com',
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
      textEncoding: options.textEncoding || 'base64',
      headers: options.headers || [
        { key: 'X-Application-Developer', value: 'Zahid Hasan' },
        { key: 'X-Application-Version', value: 'v1.0.0.2' }
      ]
    };
    const gmail = getGmailService();
    const rawMessage = await createMail(mailOptions);
    const data = await gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: rawMessage
      }
    });
    return data;
  } catch (error) {
    errorLogger.error(error);
  }
};

const createEmailContent = async (data: object, templateType: string) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      `views/email-templates/${templateType}.template.hbs`
    );
    const content = await ReadFile(templatePath, 'utf8');

    const template = Handlebars.compile(content);

    return template(data);
  } catch (error) {}
};

export const EmailHelper = {
  sendEmail,
  createEmailContent
};
