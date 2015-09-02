/**
 * Created by Dev on 2015/9/2.
 */
function CommentFilter(){
  this.modifiers = [];
  this.runtime = null;
  this.blockList = [];
  this.rules = [{
    item: "mode",
    operator: "=",
    subject: 4,
    //底部弹幕
  }];
  this.config = {
    useRegExp: false
  };
  this.allowTypes = {
    "1":true,
    "4":true,
    "5":true,
    "6":true,
    "7":true,
    "8":true,
    "17":true
  };
  var rule_modifiers = [{
    item: "mode",
    operator: "=",
    subject: 4,
    //底部弹幕
  },{
    item: 'color',
    operator: '!=',
    subject: parseInt('FFFFFF')
  },{
    item: 'text',
    operator: 'contain',
    subject: '逗逼',
    isdiy: true
  }];
  this.doModify = function(cmt){
    for(var k=0;k<this.modifiers.length;k++){
      cmt = this.modifiers[k](cmt);
    }
    return cmt;
  };
  this.beforeSend = function(cmt){
    return cmt;
  };
  this.doValidate = function(cmtData){
    if (!this.allowTypes[cmtData.mode]) return false;
    var result = true;
    var compare = function(op){
      return function(a, b){
        return eval("a" + op + "b");
      }
    };
    for (var i = 0; i < this.rules.length; ++i){
      if(!result) continue;
      //if(this.rules[i].mode != 'all' && this.rules[i].mode != cmtData.mode) continue;
      var deal = null;
      switch(this.rules[i].operator){
        case '=':
        case '==':
        case '===':
        case 'eq':
        case 'equal':
        case 'equals':
          deal = compare('=='); break;
        case '!=':
        case '!==':
        case 'ineq':
        case 'inequal':
          deal = compare('!='); break;
        case '>':
        case 'big than':
        case 'bigger':
          deal = compare('>'); break;
        case '<':
        case 'small than':
        case 'smaller':
          deal = compare('<'); break;
        case '>=':
          deal = compare('>='); break;
        case '<=':
          deal = compare('<='); break;
        case 'has':
        case 'contain':
          deal = function(){
            if (this.useRegExp){
              return function(a, b){
                var reg = new RegExp(b);
                return reg.test(a);
              }
            } else {
              return function(a, b){
                return a.indexOf(b);
              }
            }
          };
          break;
        default:
          deal = function(){return true;}; break;
      }
      this.rules[i].item = this.rules[i].item.toLowerCase();
      console.log(this.rules[i].item);
      console.log(cmtData);
      console.log(cmtData[this.rules[i].item]);
      console.log(this.rules[i].subject);
      result = !(deal(cmtData[this.rules[i].item], this.rules[i].subject));
    }
    console.log(result);
    return result;
  };
  this.addRule = function(rule){
    this.blockList.push(new RegExp(rule));
  };
  this.delRule = function(index){
    this.blockList.splice(index, 1);
  };
  this.addModifier = function(f){
    this.modifiers.push(f);
  };
  this.runtimeFilter = function(cmt){
    if(this.runtime == null)
      return cmt;
    return this.runtime(cmt);
  };
  this.setRuntimeFilter = function(f){
    this.runtime = f;
  }
}
