/**
 * CommonDanmakuFormat Parser
 * Example parser for parsing comments that the CCL can accept directly.
 * @license MIT
 * @author Jim Chen
 **/
import type { ICommentData } from '../core/Core';

var _check = function (comment:any):boolean {
  // Sanity check to see if we should be parsing these comments or not
  if (typeof comment.mode !== 'number' || typeof comment.stime !== 'number') {
    return false;
  }
  if (comment.mode === 8 && !(typeof comment.code === 'string')) {
    return false;
  }
  if (typeof comment.text !== 'string') {
    return false;
  }
  return true;
};

// Reads an attribute. Missing attributes read as '' (which parses to NaN)
var _attribute = function (elem:Element, name:string):string {
  var value = elem.getAttribute(name);
  return value !== null ? value : '';
};

export class JSONParser {
  public parseOne(comment:any):ICommentData | null {
    // Refuse to parse the comment does not pass sanity check
    return _check(comment) ? comment : null;
  }

  public parseMany(comments:Array<any>):Array<ICommentData> | null {
    // Refuse to parse if any comment does not pass sanity check
    return comments.every(_check) ? comments : null;
  }
}

export class XMLParser {
  public parseOne(comment:Element):ICommentData | null {
    var data = <ICommentData> {};
    try {
      data.stime = parseInt(_attribute(comment, 'stime'));
      data.mode = parseInt(_attribute(comment, 'mode'));
      data.size = parseInt(_attribute(comment, 'size'));
      data.color = parseInt(_attribute(comment, 'color'));
      data.text = comment.textContent;
    } catch (e) {
      return null;
    }
    return data;
  }

  public parseMany(commentsElem:Element | Document):Array<ICommentData> | null {
    var comments;
    try {
      comments = commentsElem.getElementsByTagName('comment');
    } catch (e) {
      return null;
    }
    var commentList:Array<ICommentData> = [];
    for (var i = 0; i < comments.length; i++) {
      var comment = this.parseOne(comments[i]);
      if (comment !== null) {
        commentList.push(comment);
      }
    }
    return commentList;
  }
}
