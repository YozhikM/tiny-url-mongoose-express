# TinyUrl-mongoose-express

[![Greenkeeper badge](https://badges.greenkeeper.io/YozhikM/tinyUrl-mongoose-express.svg)](https://greenkeeper.io/)

This is a simple shortening link, based on Mongoose and Express

## Requirements

To make short urls, you need the following recipe:

1.  MongoDB
2.  Mongoose
3.  Express

## API

### tinyUrlRouter()

```js
tinyUrlRouter(): Router;
```

### TinyUrl

Instance of a class

```js
TinyUrl: MongooseModel;
```

### TinyUrlSchema

```js
TinyUrlSchema: MongooseSchema;
```

## How to use

### Step 1

You can freely clone my project and take away from it two main files that you can change according to your needs.

```
git clone https://github.com/YozhikM/tinyUrl-mongoose-express.git
```

### Step 2

In the schema folder, you need to connect your database. Then connect the router to your Express routing.

```
// schema
...
mongoose.model('Tinyurl', TinyUrlSchema);
...
```

```
// server

import { tinyUrlRouter } from 'tinyUrl-mongoose-express';
...
const router = expess.Router();
router.use('/u', tinyUrlRouter());
...
```

### Step 3

Create records in Mongo and use!

```
TinyUrl.create({ url: 'example.com/hello' });
```
