import { CommentData } from '../core/interfaces';
import { Parser, ParserConfig, ParserTypes, Format } from './interfaces';

class BilibiliXmlParser implements Parser<Element, Document> {
  constructor(_config:ParserConfig) {

  }
  public parseOne(_elem:Element):CommentData {
    throw new Error('Not Implemented');
  }
  public parseMany(_doc:Document):CommentData[] {
    return [];
  }
}

export class BilibiliFormat implements Format {
  private _config:ParserConfig;
  constructor(config:ParserConfig) {
    this._config = config;
  }
  public getParser(_type:ParserTypes):Parser<any, any> {
    return new BilibiliXmlParser(this._config);
  }
}
