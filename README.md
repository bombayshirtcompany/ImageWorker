# Image worker utility
> Convert images from given url to tinyjpg and upload back to respective S3 bucket


# Setup NodeJS with below commands in sequence
- wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
- export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
- [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
- nvm install node # "node" is an alias for the latest version
- nvm install 9.5.0
- nvm use 9.5.0

# Command for starting the server
* Make a copy of all the sample files inside "configs" folder
* Rename them "sample"->"config" and place in same folder
* Update all the cofig keys and values inside that all these file
- npm start