/* @flow */

import crypto from 'crypto';
import mongoose, { Schema, Model } from 'mongoose';
import autoIncrement from 'mongoose-plugin-autoinc';

export const TinyUrlSchema = new Schema(
  {
    url: {
      type: String,
      default: '/',
      required: true,
      set: v => decodeURI(v),
    },

    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: false,
    version: false,
    collection: 'tinyUrl',
  }
);

TinyUrlSchema.plugin(autoIncrement, {
  model: 'TinyUrl',
  startAt: 100,
  incrementBy: 1,
});

export class TinyUrlDoc /* :: extends Model */ {
  // $FlowFixMe
  _id: number;
  url: string;
  createdAt: ?Date;
  encodedId: string;

  // method aded by autoIncrement plugin
  static resetCount: () => any;

  get encodedId(): string {
    const encodedString = this.constructor._encode(this._id);
    const cryptedTail = this.constructor._sign(encodedString);

    return `${encodedString}${cryptedTail}`;
  }

  static _encode(integer: number): string {
    const DEFAULT_CHARACTER_SET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (integer === 0) {
      return '0';
    }
    let s = '';
    while (integer > 0) {
      s = DEFAULT_CHARACTER_SET[integer % 62] + s;
      integer = Math.floor(integer / 62);
    }
    return s;
  }

  static _decode(base62String: string): number {
    const DEFAULT_CHARACTER_SET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let val = 0;
    const length = base62String.length;
    const characterSet = DEFAULT_CHARACTER_SET;

    for (let i = 0; i < length; i++) {
      val += characterSet.indexOf(base62String[i]) * 62 ** (length - i - 1);
    }

    return val;
  }

  static _sign(text: string): string {
    return crypto
      .createHash('md5')
      .update(`${text}${process.env.TINY_URL_SECRET_KEY || 'YOUR_SECRET_KEY'}`)
      .digest('base64')
      .slice(-4, -2);
  }

  static _parseUrl(url?: ?string): ?string {
    if (!url) return null;
    const match = /\/?([0-9a-zA-Z]+)\/?(\?.*|#.*)?$/i.exec(url);
    if (match && match[1]) return match[1];
    return null;
  }

  static async encrypt(fullUrl: string, uri: ?string = 'https://example.kz/u/'): Promise<string> {
    const newTinyUrl = await this.create({ url: fullUrl });
    return `${uri || ''}${newTinyUrl.encodedId}`;
  }

  static async decrypt(url: string): Promise<string> {
    const signedEncryptedId = this._parseUrl(url);
    if (!signedEncryptedId) {
      throw new Error('Provided wrong url for TinyUrl.decrypt');
    }

    const sign = signedEncryptedId.slice(-2);
    const checkSign = this._sign(signedEncryptedId.slice(0, -2));
    if (checkSign !== sign) {
      throw new Error('Wrong TinyUrl sign');
    } else {
      const id = this._decode(signedEncryptedId.slice(0, -2));
      const tinyUrl = await this.findById(id);
      if (!tinyUrl) {
        throw new Error('Wrong TinyUrl not found');
      }
      return tinyUrl.url;
    }
  }
}

TinyUrlSchema.loadClass(TinyUrlDoc);

export const TinyUrl = mongoose.model('Tinyurl', TinyUrlSchema);
