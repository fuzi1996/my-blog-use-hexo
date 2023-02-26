const exec = require('child_process').exec;

const args = process.argv.slice(2)


console.log('传入参数',args)

if(args.length != 2){
  console.error('传入参数有误')
  return
}

const cmdStr = `hexo new page --path /_posts/${args[0]} "${args[1]}"`
exec(cmdStr, function(err,stdout,stderr){
  if(err) {
      console.log(stderr);
  } else {
      console.log(stdout);
  }
});