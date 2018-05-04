# TinyUrl-mongoose-express

[![install size](https://packagephobia.now.sh/badge?p=tiny-url-mongoose-express@1.0.3)](https://packagephobia.now.sh/result?p=tiny-url-mongoose-express@1.0.3)
[![Greenkeeper badge](https://badges.greenkeeper.io/YozhikM/tinyUrl-mongoose-express.svg)](https://greenkeeper.io/)
![FlowType compatible](https://img.shields.io/badge/flowtype-compatible-brightgreen.svg)

This is a simple shortening link, based on Mongoose and Express

## Requirements

* [express](https://github.com/expressjs/express)
* [mongoose](https://github.com/Automattic/mongoose)
* [mongoose-plugin-autoinc](https://github.com/nodkz/mongoose-plugin-autoinc)

## API

### tinyUrlRouter()

```js
tinyUrlRouter(): Router;
```

### TinyUrl

```js
TinyUrl: MongooseModel;
```

### TinyUrlSchema

```js
TinyUrlSchema: MongooseSchema;

{
  _id: number; // start at 100
  url: string; // canonical URL
  createdAt: ?Date; // created automatically
  encodedId: string;
}
```

## How to use

### Step 1

```
yarn add tiny-url-mongoose-express
```

### Step 2

In the schema folder, you need to connect your database. Then connect the router to your Express routing.

```js
// schema
import { TinyUrl } from 'tiny-url-mongoose-express'
```

```js
// server

import { tinyUrlRouter } from 'tiny-url-mongoose-express';
//
const router = expess.Router();
router.use('/u', tinyUrlRouter());
//
```

### Step 3

Create records in Mongo and use!

```
TinyUrl.create({ url: 'example.com/hello' });
```
