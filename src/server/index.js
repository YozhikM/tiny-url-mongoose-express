/* @flow */

import express from 'express';
import type { $Request, $Response } from 'express';
import { TinyUrl } from '../schema';

export default function tinyUrlRouter() {
  const router = express.Router();

  router.get('/:tinyurl', async (req: $Request, res: $Response) => {
    const { params, originalUrl } = req;

    try {
      const url = await TinyUrl.decrypt(params.tinyurl);
      if (url) {
        const originalUrlSearch = originalUrl.split('?')[1];
        const newUrl = [url];
        if (originalUrlSearch) {
          newUrl.push(url.indexOf('?') >= 0 ? '&' : '?');
          newUrl.push(originalUrlSearch);
        }
        res.redirect(302, newUrl.join(''));
        return;
      }
    } catch (e) {
      // wrong url send 404
    }
    res.status(404).send('Not found');
  });

  return router;
}
