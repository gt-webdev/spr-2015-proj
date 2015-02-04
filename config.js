// This is the object that will be returned to
// the files that require this module
var config = {}

// Server configuration
config.server_port = process.env.PORT || 5000;
config.public_dir = './public';

// Set require's return value to config
module.exports = config;