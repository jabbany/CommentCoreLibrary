import { Scale, Position, Orientation, UpdateableCommentData }
  from '../../core/interfaces';
import { toCssColor } from '../../lib/color';

export function setProps(dom:HTMLDivElement, props:UpdateableCommentData) {
  if (typeof props.text !== 'undefined') {
    dom.innerText = props.text;
  }
  if (typeof props.border !== 'undefined') {
    dom.classList.toggle('border', props.border);
  }
  if (typeof props.outline !== 'undefined') {
    dom.classList.toggle('shadow', props.outline);
  }
  if (typeof props.color !== 'undefined') {
    dom.style.color = toCssColor(props.color);
  }
  if (typeof props.size !== 'undefined') {
    dom.style.fontSize = `${props.size}px`;
  }
  if (typeof props.font !== 'undefined') {
    dom.style.fontFamily = props.font;
  }
  if (typeof props.alpha !== 'undefined') {
    let alpha = Math.min(Math.max(props.alpha, 0), 1)
    dom.style.opacity = `${alpha}`;
  }
  if (typeof props.position !== 'undefined') {
    dom.style.left = `${props.position.x}px`;
    dom.style.top = `${props.position.y}px`;
  }
}

export function transform(offset?:Position,
  scale?:Scale, orientation?:Orientation) {

  let transforms = [];
  if (typeof offset !== 'undefined') {
    if (typeof offset.z === 'number') {
      transforms.push(
        `translate3d(${offset.x}, ${offset.y}, ${offset.z})`);
    } else {
      transforms.push(`translate(${offset.x}, ${offset.y})`);
    }
  }
  if (typeof scale !== 'undefined') {
    if (typeof scale.z === 'number') {
      transforms.push(
        `scale3d(${scale.x}, ${scale.y}, ${scale.z})`);
    } else {
      transforms.push(`scale(${scale.x}, ${scale.y})`);
    }
  }
  if (typeof scale !== 'undefined') {
    if (typeof scale.z === 'number') {
      transforms.push(
        `scale3d(${scale.x}, ${scale.y}, ${scale.z})`);
    } else {
      transforms.push(`scale(${scale.x}, ${scale.y})`);
    }
  }
  if (typeof orientation !== 'undefined') {
    if (typeof orientation.rx === 'number') {
      transforms.push(`rotateX(${orientation.rx})`)
    }
    if (typeof orientation.ry === 'number') {
      transforms.push(`rotateY(${orientation.ry})`)
    }
    if (typeof orientation.rz === 'number') {
      transforms.push(`rotateZ(${orientation.rz})`)
    }
  }
  return transforms.join(' ');
}
