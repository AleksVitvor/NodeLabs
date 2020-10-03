var util = require('util');
var ee = require('events');

var db_data= [
    {id:1, name:'Иванов И.И.', bday:'2001-01-02'},
    {id:2, name:'Иванов А.И.', bday:'2001-01-02'},
    {id:3, name:'Иванов К.И.', bday:'2001-01-02'}
]

var statistics=[];

function DB()
{
    this.get=()=>{return db_data;};
    this.post=(r)=>{db_data.push(r);};
    this.update=(r)=>{db_data.splice(db_data.findIndex(u=>u.id==r.id),1,r);};
    this.remove=(r)=>
    {
        let data=db_data.find(u=>u.id==r);
        db_data.splice(db_data.findIndex(u=>u.id==r),1);
        return data;
    };
    this.commit=()=>{};
    this.saveStat=(r)=>{statistics.push(r);};
    this.loadLastStat=()=>{return statistics[statistics.length-1];};
}

util.inherits(DB, ee.EventEmitter);

exports.DB=DB;