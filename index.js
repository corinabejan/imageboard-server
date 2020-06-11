const express = require('express');
const app = express();
const port = 4000;
const userRouter = require('./routers/user');
const imageRouter = require('./routers/image');
const authRouter = require('./routers/auth');
const jsonParser = express.json();

app.use(jsonParser);

app.use('/users', userRouter);
app.use('/images', imageRouter);
app.use('/login', authRouter);

app.listen(port, () => console.log(`Listening to port ${port}`));
