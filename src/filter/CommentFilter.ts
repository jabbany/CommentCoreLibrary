/**
 * Comment Filters Module Simplified
 * @license MIT
 * @author Jim Chen
 */

/**
 * Rule for filtering comments
 */
export interface FilterRule {
  /**
   * Whether matching comments are accepted or rejected
   */
  mode?:string;
  /**
   * Dot-separated path to the comment data property being tested
   */
  subject:string;
  op:string;
  value:any;
}

/**
 * Matches a rule against an input that could be the full or a subset of
 * the comment data.
 *
 * @param rule - rule object to match
 * @param cmtData - full or portion of comment data
 * @return boolean indicator of match
 */
function _match (rule:FilterRule, cmtData:any):boolean {
  var path = rule.subject.split('.');
  var extracted = cmtData;
  while (path.length > 0) {
    var item = path.shift();
    if (item === '') {
      continue;
    }
    if (extracted.hasOwnProperty(item)) {
      extracted = extracted[item];
    }
    if (extracted === null || typeof extracted === 'undefined') {
      extracted = null;
      break;
    }
  }
  if (extracted === null) {
    // Null precondition implies anything
    return true;
  }
  switch (rule.op) {
    case '<':
      return extracted < rule.value;
    case '>':
      return extracted > rule.value;
    case '~':
    case 'regexp':
      return (new RegExp(rule.value)).test(extracted.toString());
    case '=':
    case 'eq':
      return rule.value ===
        ((typeof extracted === 'number') ?
          extracted : extracted.toString());
    case '!':
    case 'not':
      return !_match(rule.value, extracted);
    case '&&':
    case 'and':
      if (Array.isArray(rule.value)) {
        return rule.value.every(function (r) {
          return _match(r, extracted);
        });
      } else {
        return false;
      }
    case '||':
    case 'or':
      if (Array.isArray(rule.value)) {
        return rule.value.some(function (r) {
          return _match(r, extracted);
        });
      } else {
        return false;
      }
    default:
      return false;
  }
}

export class CommentFilter {
  public rules:Array<FilterRule> = [];
  public modifiers:Array<Function> = [];
  public allowUnknownTypes:boolean = true;
  public allowTypes:{[mode:string]:boolean} = {
    '1': true,
    '2': true,
    '4': true,
    '5': true,
    '6': true,
    '7': true,
    '8': true,
    '17': true
  };

  /**
   * Runs all modifiers against current comment
   *
   * @param cmt - comment to run modifiers on
   * @return modified comment
   */
  public doModify(cmt:any):any {
    return this.modifiers.reduce(function (c, f) {
      return f(c);
    }, cmt);
  }

  /**
   * Executes a method defined to be executed right before the comment object
   * (built from commentData) is placed onto the runline.
   *
   * @deprecated
   * @param cmt - comment data
   * @return cmt
   */
  public beforeSend(cmt:any):any {
    return cmt;
  }

  /**
   * Performs validation of the comment data before it is allowed to get sent
   * by applying type constraints and rules
   *
   * @param cmtData - comment data
   * @return boolean indicator of whether this commentData should be shown
   */
  public doValidate(cmtData:any):boolean {
    if (!cmtData.hasOwnProperty('mode')) {
      return false;
    }
    if ((!this.allowUnknownTypes ||
        cmtData.mode.toString() in this.allowTypes) &&
      !this.allowTypes[cmtData.mode.toString()]) {
      return false;
    }
    return this.rules.every(function (rule) {
      // Decide if matched
      var matched;
      try {
        matched = _match(rule, cmtData);
      } catch (e) {
        matched = false;
      }
      return rule.mode === 'accept' ? matched : !matched;
    });
  }

  /**
   * Adds a rule for use with validation
   *
   * @param rule - object containing rule definitions
   * @throws Exception when rule mode is incorrect
   */
  public addRule(rule:FilterRule):void {
    if (rule.mode !== 'accept' && rule.mode !== 'reject') {
      throw new Error('Rule must be of accept type or reject type.');
    }
    this.rules.push(rule);
  }

  /**
   * Removes a rule
   *
   * @param rule - the rule that was added
   * @return true if the rule was removed, false if not found
   */
  public removeRule(rule:FilterRule):boolean {
    var index = this.rules.indexOf(rule);
    if (index >= 0) {
      this.rules.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Adds a modifier to be used
   *
   * @param modifier - modifier function that takes in comment data and
   *           returns modified comment data
   * @throws Exception when modifier is not a function
   */
  public addModifier(f:Function):void {
    if (typeof f !== 'function') {
      throw new Error('Modifiers need to be functions.');
    }
    this.modifiers.push(f);
  }
}
