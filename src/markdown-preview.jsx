import { marked } from 'marked';
import React, { useState } from 'react';
import Prism from 'prismjs';
import './markdown-preview.scss';

const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!
And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)`;

function MarkdownPreview() {

	marked.setOptions({
		breaks: true,
		highlight: function (code) {
			return Prism.highlight(code, Prism.languages.javascript, 'javascript');
		}
	});

	function debounce(func, time) {
		const t = time ?? 1000
		let timer;
		return function (...args) {
			clearTimeout(timer)
			timer = setTimeout(() => {
				func && func.apply(this, args)
			}, t);
		}
	}

	const [text, setText] = useState(placeholder);
	const debounceTextSetter = debounce(setText, 500)

	const handleInput = (e) => {
		debounceTextSetter(e.target.value)
	}

	return (
		<div>
			<textarea id="editor" defaultValue={text} onInput={handleInput} />
			<div id="preview" dangerouslySetInnerHTML={{ __html: marked.parse(text) }} />
		</div>
	);
}

export default MarkdownPreview
