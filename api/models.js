var mysql = require('mysql');
var quell = require('quell');

quell.connection = mysql.createConnection({
  host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : 'shack'
});

var proto = {
  toJson: function(){
    if(!this.public){
      throw new Error('No public fields defined on table.');
    }
    return this.public.reduce(
      (object, column) => (
        object[column] = this.data[column],
        object
      )
    );
  }
};

var User = quell('users', Object.assign({
    public: ['email']
  },
  proto)
);

User.load = function(...args){
  console.log(args);
  var record = new this();
  console.log(record, this);
  return record.load(...args).then(
    exists => {
      console.log(exists, record);
      if(exists)
        return record;
      
      throw new Error('Record doesn\'t exist');
    }
  )
}

module.exports = {
  User
};
