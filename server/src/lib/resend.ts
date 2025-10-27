import { Resend } from "resend";
import config from "../config/config";

export const resend = new Resend(config.RESEND_API_KEY as string);

export interface EmailOptions {
  to?: string;
  subject: string;
  html: string;
}