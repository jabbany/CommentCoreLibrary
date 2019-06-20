import { CommentData, AnimationMode, UpdateablePosition, Waypoint }
  from '../core/interfaces';
import { Parser, ParserConfig, ParserTypes, Format } from './interfaces';

interface CommentSingle {
  /**
   * Configuration for the comment
   */
  c?:string;
  /**
   * Message for the comment
   */
  m?:string;
}

interface MovementParams {
  l?:number;
  x?:number;
  y?:number;
}

interface CommentParams {
  n:string;
  a?:number;
  p?:{x:number, y:number};
  c?:number;
  b?:boolean;
  l?:number;
  z?:MovementParams[];
  w?:{f:string, l:any[]},
  r?:number;
  k?:number;
}

class AcFunJsonParser implements Parser<CommentSingle, CommentSingle[]> {
  private defaultDuration:number = 4000;
  private config:ParserConfig;

  constructor(config:ParserConfig) {
    this.config = config;
  }

  private modeToType(mode:number):AnimationMode {
    if (mode === 1 || mode === 2) {
      return 'scroll-left';
    } else if (mode === 6) {
      return 'scroll-right';
    } else if (mode === 4 || mode == 5) {
      return 'fixed';
    } else if (mode === 7) {
      return 'path';
    }
    return 'fixed';
  }

  public parseOne(input:CommentSingle):CommentData {
    // Temporary item to
    if (input == null || !input.hasOwnProperty('c') ||
      typeof input.c === 'undefined') {

      throw new Error('Format Error: Expects "c" parameter!');
    }
    let config = input['c'].split(',');
    if (config.length >= 6) {
      // Start up with a basic info object
      var mode = parseInt(config[2]);
      let data:CommentData = {
        startTime: parseFloat(config[0]) * 1000,
        text: '',
        alpha: 1,
        border: false,
        color: parseInt(config[1]),
        size: parseInt(config[3]),
        outline: true,
        font: null,
        id: `u:${config[4]},t:${config[5]}`,
        date: parseInt(config[5]),
        position: {
          x: 0,
          y: 0,
          axis: 'top-left',
          mode: 'absolute'
        },
        orientation: {
          rx:0,
          ry:0,
          rz:0
        },
        scale: {
          x:1,
          y:1,
          z:1
        },
        anchor: {
          vertical: 0,
          horizontal: 0
        },
        animation: {
          duration: this.defaultDuration,
          mode: this.modeToType(mode)
        }
      };
      if (mode !== 7) {
        if (typeof input.m === 'string') {
          data.text = input.m.replace(/(\/n|\\n|\n|\r\n|\\r)/g,"\n");
          data.text = data.text.replace(/\r/g,"\n");
          data.text = data.text.replace(/\s/g,"\u00a0");
        } else {
          throw new Error('Format Error: Text field "m" does not exist.');
        }
        return data;
      } else {
        // There is extra data in the comment
        if (typeof input.m === 'undefined') {
          throw new Error('Format Error: Complex field "m" does not exist.');
        }
        try {
          var params = JSON.parse(input.m) as CommentParams;
        } catch (e) {
          throw new Error('Advanced mode JSON parse failed: ' + input.m);
        }
        // Mode 7 in acfun uses relative positioning
        data.position.mode = 'relative';
        data.text = params.n;
        data.text = data.text.replace(/\ /g,"\u00a0");

        if (typeof params.a === 'number') {
          data.alpha = Math.max(Math.min(params.a, 1), 0);
        }

        if (typeof params.p === 'object') {
          data.position.x = params.p.x / 1000;
          data.position.y = params.p.y / 1000;
        }

        if (typeof params.c === 'number') {
          if (params.c < 3) {
            data.anchor.vertical = 0;
          } else if (params.c >= 3 && params.c < 6) {
            data.anchor.vertical = 0.5;
          } else if (params.c >= 6 && params.c < 9) {
            data.anchor.vertical = 1;
          } else {
            throw new Error('Data error: Anchor out of bounds');
          }
          if (params.c % 3 === 0) {
            data.anchor.horizontal = 0;
          } else if (params.c % 3 === 1) {
            data.anchor.horizontal = 0.5;
          } else if (params.c % 3 === 2) {
            data.anchor.horizontal = 1;
          }
        }

        data.outline = params.b !== false;
        if (typeof params.l === 'number') {
          data.animation.duration = params.l * 1000;
        }

        if (typeof params.z !== 'undefined' && Array.isArray(params.z)) {
          data.animation.mode = 'path';
          data.animation.path = [];
          for (let m = 0; m < params.z.length; m++) {
            let movement = params.z[m];
            let duration = (typeof movement.l === 'number') ?
              (movement.l * 1000) : 500;
            // Create the current waypoint
            let point:Waypoint = {
              duration: duration,
              interpolation:'linear'
            };

            if (movement.x !== null || movement.y !== null) {
              // We moved
              let newPos:UpdateablePosition = {};
              if (movement.x !== null) {
                newPos.x = movement.x;
              }
              if (movement.y !== null) {
                newPos.y = movement.y;
              }
              point.position = newPos;
            }

            data.animation.path.push(point);
          }
        }

        if (typeof params.r === 'number') {
          data.orientation.rx = params.r;
        }
        if (typeof params.k === 'number') {
          data.orientation.ry = params.k;
        }
        return data;
      }
    } else {
        throw new Error('Underspecified: Insufficient config parameters, ' +
          'expecting at least 6.');
    }
  }
  public parseMany(input:CommentSingle[]):CommentData[] {
    input.map((data) => {
      try {
        return this.parseOne(data);
      } catch (e) {
        if (!this.config.bestEffort) {
          throw e;
        }
        return null;
      }
    }).filter((value) => value === null);
    return [];
  }
}

export class AcFunFormat implements Format {
  private _config:ParserConfig;
  constructor(config:ParserConfig) {
    this._config = config;
  }
  public getParser(_type:ParserTypes):Parser<any, any> {
    return new AcFunJsonParser(this._config);
  }
}
