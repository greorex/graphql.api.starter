mkdir bin
babel server.js -o bin/server.js
babel config.js -o bin/config.js
babel src -d bin/src
cp package.json bin/package.json
cp package-lock.json bin/package-lock.json