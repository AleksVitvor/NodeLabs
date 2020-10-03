var sendmail=require('sendmail')({silent:true});

module.exports.Send=(r)=>
{
    sendmail({
        from: `avitvor@gmail.com`,
        to: `detohef200@treeheir.com`,
        html: r
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
}