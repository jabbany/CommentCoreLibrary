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
    mode?: string;
    /**
     * Dot-separated path to the comment data property being tested
     */
    subject: string;
    op: string;
    value: any;
}
export declare class CommentFilter {
    rules: Array<FilterRule>;
    modifiers: Array<Function>;
    allowUnknownTypes: boolean;
    allowTypes: {
        [mode: string]: boolean;
    };
    /**
     * Runs all modifiers against current comment
     *
     * @param cmt - comment to run modifiers on
     * @return modified comment
     */
    doModify(cmt: any): any;
    /**
     * Executes a method defined to be executed right before the comment object
     * (built from commentData) is placed onto the runline.
     *
     * @deprecated
     * @param cmt - comment data
     * @return cmt
     */
    beforeSend(cmt: any): any;
    /**
     * Performs validation of the comment data before it is allowed to get sent
     * by applying type constraints and rules
     *
     * @param cmtData - comment data
     * @return boolean indicator of whether this commentData should be shown
     */
    doValidate(cmtData: any): boolean;
    /**
     * Adds a rule for use with validation
     *
     * @param rule - object containing rule definitions
     * @throws Exception when rule mode is incorrect
     */
    addRule(rule: FilterRule): void;
    /**
     * Removes a rule
     *
     * @param rule - the rule that was added
     * @return true if the rule was removed, false if not found
     */
    removeRule(rule: FilterRule): boolean;
    /**
     * Adds a modifier to be used
     *
     * @param modifier - modifier function that takes in comment data and
     *           returns modified comment data
     * @throws Exception when modifier is not a function
     */
    addModifier(f: Function): void;
}
