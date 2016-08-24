#!/bin/bash

# Add your local node_modules bin to the path for this command
#export PATH="./node_modules/.bin:$HOME/n/.bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
#export NODE_PATH="/usr/local/lib/node_modules:$HOME/n/lib/node_modules:$NODE_PATH"
export PATH="./node_modules/.bin:$HOME/n/.bin:$PATH"
export NODE_PATH="/usr/local/lib/node_modules:$HOME/n/lib/node_modules:$NODE_PATH"

# execute the rest of the command
exec "$@"
