/**
 * Basic CSS Accelerated Comment Abstraction
 *
 * @author Jim Chen
 * @license MIT License
 * @description Comment abstraction based on CSS3 implementation
 */
import type { IComment } from '../Core';
import { ScrollComment } from '../Comment';
export declare class CssScrollComment extends ScrollComment {
    private _dirtyCSS;
    init(recycle?: IComment | null): void;
    protected _calculateX(): number;
    get x(): number;
    set x(x: number);
    update(): void;
    invalidate(): void;
    /**
     * Override the toplevel stop to actually stop the CSS.
     */
    stop(): void;
}
