const express = require('express');
const router = express.Router();

const userRouter = require('./user/user.router');
const toolsRouter = require('./tools/tools.router');
const booksRouter = require('./books/books.router');
const quotesRouter = require('./quotes/quotes.router');
const storiesRouter = require('./stories/stories.router');
const devRouter = require('./dev/dev.router');
const getSignedUrl = require('../../controllers/getSignedUrl');

// router.use('/', (req,res) => {
//     res.render('index');
// });
router.use('/', userRouter);
router.use('/', toolsRouter);
router.use('/', booksRouter);
router.use('/', quotesRouter);
router.use('/', storiesRouter);
router.use('/', devRouter);
router.use('/file/upload', getSignedUrl);

module.exports = router;
