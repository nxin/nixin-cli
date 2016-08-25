#!/bin/bash

# Add your local node_modules bin to the path for this command
#export PATH="./node_modules/.bin:$HOME/n/.bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
#export NODE_PATH="/usr/local/lib/node_modules:$HOME/n/lib/node_modules:$NODE_PATH"

NODE_EXPORT_PATH_GLOBAL="/usr/local/lib/node_modules"
NODE_EXPORT_PATH_PROJECT="./node_modules/.bin"

if [ "$N_PREFIX" != '' ]; then
    NODE_EXPORT_PATH_WITH_N=":$N_PREFIX/lib/node_modules"
else
    NODE_EXPORT_PATH_WITH_N=""
fi

NODE_EXPORT_PATH="$NODE_EXPORT_PATH_GLOBAL$NODE_EXPORT_PATH_WITH_N:$NODE_PATH"

getNodePath() {
    if [[ ":$NODE_PATH:" != *":$NODE_EXPORT_PATH_GLOBAL:"* ]]; then
        NODE_PATH="$NODE_EXPORT_PATH_GLOBAL:$NODE_PATH"
    fi

    if [[ ":$NODE_PATH:" != *"$NODE_EXPORT_PATH_WITH_N:"* ]]; then
        NODE_PATH="$NODE_PATH$NODE_EXPORT_PATH_WITH_N"
    fi

    echo "$NODE_PATH"
}

getPath() {
    if [[ ":$PATH:" != *":$NODE_EXPORT_PATH_PROJECT:"* ]]; then
        PATH="$PATH:$NODE_EXPORT_PATH_PROJECT"
    fi

    echo "$PATH"
}

#if [ -f $HOME/$USER_PATH/.bash_profile ]; then
    #.bash_profile exists

    cat $HOME/$USER_PATH/.bash_profile | grep NODE_PATH >>/dev/null
    NPM_EXIST=$(echo $?)

    if [ $NPM_EXIST != 0 ]; then
        echo -e "\n##########Added By nixin-CLI\n##########\nexport NODE_PATH=\"$NODE_EXPORT_PATH\"\n##########\n" >>$HOME/$USER_PATH/.bash_profile
        echo -e "\nNODE_PATH added into .bash_profile\n"
    else
        NODE_PATH=$(getNodePath)
        sed -i '' "s~^export NODE_PATH=.*$~export NODE_PATH=\"$NODE_PATH\"~g" $HOME/$USER_PATH/.bash_profile
        echo -e "\nNODE_PATH updated into .bash_profile\n"
    fi

    NEW_PATH=$(getPath)
    sed -i '' "s~^export PATH=.*$~export PATH=\"$NEW_PATH\"~g" $HOME/$USER_PATH/.bash_profile
    echo -e "\nPATH updated into .bash_profile\n"
#fi

if [ -f $HOME/$USER_PATH/.zshenv ]; then
    #.zshenv exists

    cat $HOME/$USER_PATH/.zshenv | grep NODE_PATH >>/dev/null
    NPM_EXIST=$(echo $?)

    if [ $NPM_EXIST != 0 ]; then
        echo -e "\n##########Added By nixin-CLI\n##########\nexport NODE_PATH=\"$NODE_EXPORT_PATH\"\n##########\n" >>$HOME/$USER_PATH/.zshenv
        echo -e "\nNODE_PATH added into .zshenv\n"
    else
        NODE_PATH=$(getNodePath)
        sed -i '' "s~^export NODE_PATH=.*$~export NODE_PATH=\"$NODE_PATH\"~g" $HOME/$USER_PATH/.zshenv
        echo -e "\nNODE_PATH updated into .zshenv\n"
    fi

    NEW_PATH=$(getPath)
    sed -i '' "s~^export PATH=.*$~export PATH=\"$NEW_PATH\"~g" $HOME/$USER_PATH/.zshenv
    echo -e "\nPATH updated into .zshenv\n"
fi

# execute the rest of the command
#exec "$@"
