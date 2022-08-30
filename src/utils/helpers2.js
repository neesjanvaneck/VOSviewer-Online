/* eslint-disable consistent-return */
import HTMLReactParser from 'html-react-parser';
import { addHook, sanitize } from "dompurify";
import { css } from '@emotion/css';

export function cleanPlainText(plainText) {
  if (!plainText) return;
  const sanitizedText = sanitize(plainText,
    {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });

  return sanitizedText;
}

export function parseFormattedText(formattedText) {
  if (!formattedText) return;
  addHook('afterSanitizeAttributes', (node) => {
    if ('target' in node) {
      node.setAttribute('target', '_blank'); // Let all links open a new window.
      node.setAttribute('rel', 'noopener noreferrer'); // Prevent reverse tabnabbing attacks (https://www.owasp.org/index.php/Reverse_Tabnabbing).
    }
  });
  const sanitizedDescription = sanitize(formattedText); // Sanitize HTML and prevents XSS attacks (https://owasp.org/www-community/attacks/xss/).

  return HTMLReactParser(sanitizedDescription, {
    replace: node => {
      if (node.name === 'a') {
        node.attribs.class = css(`text-decoration: underline; color: inherit;`);
      }
    }
  });
}

export function parseDescription(object, templateType, stores) {
  const { dataStore, visualizationStore } = stores;
  if (!object) return;
  const description = object.description || dataStore.templates[templateType];
  if (!description) return;
  addHook('afterSanitizeAttributes', (node) => {
    if ('target' in node) {
      node.setAttribute('target', '_blank'); // Let all links open a new window.
      node.setAttribute('rel', 'noopener noreferrer'); // Prevent reverse tabnabbing attacks (https://www.owasp.org/index.php/Reverse_Tabnabbing).
    }
  });
  const sanitizedDescription = sanitize(description); // Sanitize HTML and prevents XSS attacks (https://owasp.org/www-community/attacks/xss/).


  return HTMLReactParser(sanitizedDescription, {
    replace: node => {
      if (node.attribs) {
        if (node.attribs.class && typeof dataStore.styles[node.attribs.class] === 'string') {
          node.attribs.class = css(dataStore.styles[node.attribs.class]);
        }
        if (node.name === 'a' && node.attribs.href) node.attribs.href = _replaceDescriptionPlaceholders(node.attribs.href, object, templateType, visualizationStore);
        if (node.name === 'img' && node.attribs.src) node.attribs.src = _replaceDescriptionPlaceholders(node.attribs.src, object, templateType, visualizationStore);
      }
      if (node.data) node.data = _replaceDescriptionPlaceholders(node.data, object, templateType, visualizationStore);
    }
  });
}

function _replaceDescriptionPlaceholders(text, object, templateType, visualizationStore) {
  const findMatches = [...text.matchAll(/\{(.*?)\}/g)];
  if (!findMatches.length) return text;
  let resultValue = text;
  findMatches.forEach(findMatch => {
    const asseccor = findMatch[1];
    let replaceValue = object[asseccor];
    if (templateType === 'link_description') {
      const findMatchSource = asseccor.match(/source_(.*)/);
      const findMatchTarget = asseccor.match(/target_(.*)/);
      if (findMatchSource) {
        const sourceNode = visualizationStore.itemsForLinks[object.from];
        replaceValue = sourceNode[findMatchSource[1]];
      } else if (findMatchTarget) {
        const targetNode = visualizationStore.itemsForLinks[object.to];
        replaceValue = targetNode[findMatchTarget[1]];
      }
    }
    resultValue = (replaceValue && resultValue.replace(findMatch[0], replaceValue)) || '';
  });

  return resultValue;
}
