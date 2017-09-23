const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull
} = require('graphql');

const {
    GraphQLLimitedString
} = require('graphql-custom-types');

const {
    getPosts,
    getAuthor,
    getAuthors,
    getComments,
    createPost,
    createComment,
    createAuthor,
} = require('./db');

const Author = new GraphQLObjectType({
    name: "Author",
    description: "Author of the blog post",
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        }
    })
});

const Comment = new GraphQLObjectType({
    name: "Comment",
    description: "Comment on the blog post",
    fields: () => ({
        id: {
            type: GraphQLString
        },
        content: {
            type: GraphQLString
        },
        author: {
            type: Author,
            resolve: function ({
                author
            }) {
                return getAuthor(author);
            }
        }
    })
});

const Post = new GraphQLObjectType({
    name: "Post",
    description: "Blog post content",
    fields: () => ({
        id: {
            type: GraphQLString
        },
        title: {
            type: GraphQLString
        },
        bodyContent: {
            type: GraphQLString
        },
        author: {
            type: Author,
            resolve: function ({
                author
            }) {
                return getAuthor(author);
            }
        },
        comments: {
            type: new GraphQLList(Comment),
            resolve: function (post) {
                return getComments(post.id);
            }
        }
    })
});

const Query = new GraphQLObjectType({
    name: 'BlogSchema',
    description: "Root of the Blog Schema",
    fields: () => ({
        posts: {
            type: new GraphQLList(Post),
            description: "List of posts in the blog",
            args: {
                authorId: {
                    type: new GraphQLNonNull(GraphQLString)
                },
            },
            resolve: function (source, {
                authorId
            }) {
                return getPosts(authorId);
            }
        },
        authors: {
            type: new GraphQLList(Author),
            description: "List of Authors",
            resolve: function () {
                return getAuthors();
            }
        },
        author: {
            type: Author,
            description: "Get Author by id",
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: function (source, {
                id
            }) {
                return getAuthor(id);
            }
        }
    })
});

const Mutuation = new GraphQLObjectType({
    name: 'BlogMutations',
    fields: {
        createPost: {
            type: Post,
            description: "Create blog post",
            args: {
                title: {
                    type: new GraphQLLimitedString(10, 30)
                },
                bodyContent: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                author: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "Id of the author"
                }
            },
            resolve: function (source, args) {
                return createPost(args);
            }
        },
        createComment: {
            type: Comment,
            description: "Add comment to blog post",
            args: {
                content: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                author: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "Id of the comment author"
                },
                post: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "Id of the post"
                }
            },
            resolve: function (source, args, ctx) {
                return createComment(args);
            }
        },
        createAuthor: {
            type: Author,
            description: "Add an author",
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
            },
            resolve: function (source, args, ctx) {
                return createAuthor(args);
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutuation
});

module.exports = {
    Schema,
};