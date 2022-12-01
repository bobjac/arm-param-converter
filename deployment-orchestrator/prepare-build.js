var ncp = require('ncp').ncp;

ncp.limit = 40;
ncp("./prod", "./dist", function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('done!');
});
ncp("./client", "./dist/client", function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('done!');
});
ncp("./node_modules", "./dist/node_modules", function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('done!');
});

