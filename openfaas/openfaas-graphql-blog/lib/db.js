const {
    Database,
    aql
} = require('arangojs');
const Promise = require('bluebird');

// Using a complex connection string with authentication
const host = process.env.ARANGODB_HOST;
const port = process.env.ARANGODB_PORT;
const database = process.env.ARANGODB_DB;
const username = process.env.ARANGODB_USERNAME;
const password = process.env.ARANGODB_PASSWORD;

const db = new Database({
    url: `http://${username}:${password}@${host}:${port}`,
    databaseName: database
});

const postsTable = 'posts'
const authorsTable = 'authors'
const commentsTable = 'comments'

function createAuthor(author) {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(authorsTable);
        collection.save(author, {
                returnNew: true
            })
            .then(result => resolve(Object.assign(result.new, {
                id: result._key
            })))
            .catch(err => reject(err));

    });
}

function createPost(post) {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(postsTable);
        collection.save(post, {
                returnNew: true
            })
            .then(result => resolve(Object.assign(result.new, {
                id: result._key
            })))
            .catch(err => reject(err));

    });
}

function createComment(comment) {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(commentsTable);
        collection.save(comment, {
                returnNew: true
            })
            .then(result => resolve(Object.assign(result.new, {
                id: result._key
            })))
            .catch(err => reject(err));

    });
}

function getPosts(authorId) {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(postsTable);

        collection.byExample({
                "author": authorId
            })
            .then(c => c.all())
            .then(results => {
                const formatted = results.map(result => Object.assign(result, {
                    id: result._key
                }))
                resolve(formatted);
            })
            .catch(err => reject(err));

    });
}

function getAuthor(id) {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(authorsTable);
        collection.firstExample({
                _key: id
            })
            .then(result => resolve(Object.assign(result, {
                id: id
            })))
            .catch(err => reject(err));

    });
}

function getAuthors() {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(authorsTable);
        collection.all()
            .then(c => c.all())
            .then(results => {
                const formatted = results.map(result => Object.assign(result, {
                    id: result._key
                }))
                resolve(formatted);
            })
            .catch(err => reject(err));
    });
}

function getComments(postId) {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(commentsTable);
        collection.byExample({
                "post": postId
            })
            .then(c => c.all())
            .then(results => {
                const formatted = results.map(result => Object.assign(result, {
                    id: result._key
                }))
                resolve(formatted);
            })
            .catch(err => reject(err));
    });
}

module.exports = {
    createPost,
    createComment,
    createAuthor,
    getPosts,
    getAuthor,
    getAuthors,
    getComments,
}