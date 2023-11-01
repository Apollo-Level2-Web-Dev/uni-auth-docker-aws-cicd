export interface IEmailAttachment {
  filename?: string;
  path?: string;
  content?: string;
}

export interface IEmailOptions {
  to: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: IEmailAttachment[];
  textEncoding?: string;
  headers?: { key: string; value: string }[];
}
