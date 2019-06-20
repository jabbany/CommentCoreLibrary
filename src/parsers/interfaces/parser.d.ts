import { CommentData } from '../../core/interfaces';

/**
 * Interface for a generic parser
 * @param T
 */
export interface Parser<T, U> {
  parseOne(input:T):CommentData;
  parseMany(input:U):CommentData[];
}

export interface ParserConfig {
  strictSafety:boolean;
  bestEffort:boolean;
}

export enum ParserTypes {
  'JSON', 'XML', 'Text'
}
