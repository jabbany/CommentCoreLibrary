export function toCssColor(color:number):string {
  var cssColor:string = color.toString(16);
  if (cssColor.length < 6) {
    cssColor = new Array(6 - cssColor.length + 1).join('0') + cssColor;
  }
  return '#' + color;
}
