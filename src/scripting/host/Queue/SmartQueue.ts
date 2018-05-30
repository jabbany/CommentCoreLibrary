/**
 * Smart queue that can combine items that "override" earlier ones by removing
 * earlier occurrances of the item
 * @author Jim Chen
 */

export interface UpdateItem {
  /**
   * The "class" that this UpdateItem is in. Items of the same class may
   * override each other.
   */
  group:string;
  /**
   * Boolean value indicating whether to allow future items to override this one
   */
  allowOverride:boolean;
  /**
   * Boolean value indicating whether the current item will trigger an override
   */
  triggerOverride:boolean;
}

export class SmartQueue<T extends UpdateItem> {
  private _groups:{[groupName:string]: T[]} = {};
  public items:T[] = [];

  private prune(groupName:string):void {
    // Remove all the items in group that allow override
    if (groupName in this._groups) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].group === groupName) {
          if (this.items[i].allowOverride) {
            // Remove from both _groups and main list
            if (this.items[i] !== this._groups[groupName].shift()) {
              throw new Error('SmartQueue desynchronized. Expected ' +
                this.items[i]);
            }
            this.items.splice(i, 1);
            i--;
            // Continue the loop but since we removed this element,
            // we look at this element's index again,
          }
        }
      }
    }
  }

  public enqueue(item:T):void {
    if (item.triggerOverride) {
      this.prune(item.group);
    }
    this.items.push(item);
    if (!(item.group in this._groups)) {
      this._groups[item.group] = [];
    }
    this._groups[item.group].push(item);
  }

  public dequeue():T {
    // Get the item from the list
    var item:T = this.items.shift();
    // Also remove it from its group and do a sanity check
    if (this._groups[item.group].shift() !== item) {
      throw new Error('SmartQueue desynchronized. Expected ' + item);
    }
    return item;
  }

  public clear():void {
    this._groups = {};
    this.items = [];
  }
}
