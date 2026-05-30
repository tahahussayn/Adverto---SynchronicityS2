import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export default async function DocumentationPage() {
  const filePath = path.join(process.cwd(), 'content', 'documentation.md');
  const content = await fs.promises.readFile(filePath, 'utf8');

  return (
    <div className="flex-1 flex flex-col min-w-0 px-sm md:px-lg py-lg">
      <header className="mb-lg">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-1">Documentation</h1>
      </header>
      <div className="glass-panel p-lg rounded-lg max-w-4xl">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-on-surface mb-6" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-bold text-on-surface mt-6 mb-3" {...props} />,
            p: ({node, ...props}) => <p className="text-on-surface-variant mb-4 leading-relaxed" {...props} />,
            a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-on-surface-variant" {...props} />,
            li: ({node, ...props}) => <li className="mb-1" {...props} />,
            code: ({node, ...props}) => <code className="bg-surface-container-high px-1 py-0.5 rounded text-sm text-primary" {...props} />,
            pre: ({node, ...props}) => <pre className="bg-surface-container-highest p-4 rounded-lg overflow-x-auto mb-6 border border-outline-variant text-sm" {...props} />,
            hr: ({node, ...props}) => <hr className="my-8 border-outline-variant" {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
