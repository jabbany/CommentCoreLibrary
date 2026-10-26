/**
 * CommonDanmakuFormat Parser
 * Example parser for parsing comments that the CCL can accept directly.
 * @license MIT
 * @author Jim Chen
 **/
import type { ICommentData } from '../core/Core';

var _check = function (comment) {
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

export class JSONParser {
  public parseOne(comment:any):ICommentData {
    // Refuse to parse the comment does not pass sanity check
    return _check(comment) ? comment : null;
  }

  public parseMany(comments:Array<any>):Array<ICommentData> {
    // Refuse to parse if any comment does not pass sanity check
    return comments.every(_check) ? comments : null;
  }
}

export class XMLParser {
  public parseOne(comment:Element):ICommentData {
    var data = <ICommentData> {};
    try {
      data.stime = parseInt(comment.getAttribute('stime'));
      data.mode = parseInt(comment.getAttribute('mode'));
      data.size = parseInt(comment.getAttribute('size'));
      data.color = parseInt(comment.getAttribute('color'));
      data.text = comment.textContent;
    } catch (e) {
      return null;
    }
    return data;
  }

  public parseMany(commentsElem:Element | Document):Array<ICommentData> {
    var comments;
    try {
      comments = commentsElem.getElementsByTagName('comment');
    } catch (e) {
      return null;
    }
    var commentList = [];
    for (var i = 0; i < comments.length; i++) {
      var comment = this.parseOne(comments[i]);
      if (comment !== null) {
        commentList.push(comment);
      }
    }
    return commentList;
  }
}
