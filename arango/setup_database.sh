#!/bin/bash
set -e

ARANGODB_DB=graphql-blog
ARANGODB_USERNAME=root
ARANGODB_PASSWORD=openfaasgraphqlblog
ENDPOINT=http://$ARANGODB_USERNAME:$ARANGODB_PASSWORD@localhost:8529

# create 'graphql-blog' database
curl -X POST --data-binary @- --dump - $ENDPOINT/_api/database <<EOF
{
  "name" : "$ARANGODB_DB"
}
EOF


# create 'posts' collection
curl -X POST --data-binary @- --dump - $ENDPOINT/_db/$ARANGODB_DB/_api/collection <<EOF
{
  "name" : "posts"
}
EOF

# create 'comments' collection
curl -X POST --data-binary @- --dump - $ENDPOINT/_db/$ARANGODB_DB/_api/collection <<EOF
{
  "name" : "comments"
}
EOF

# create 'authors' collection
curl -X POST --data-binary @- --dump - $ENDPOINT/_db/$ARANGODB_DB/_api/collection <<EOF
{
  "name" : "authors"
}
EOF

echo ""
echo ""
echo "Database Setup Complete!"