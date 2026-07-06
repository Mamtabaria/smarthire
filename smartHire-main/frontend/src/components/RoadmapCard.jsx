const URL_REGEX = /(https?:\/\/[^\s)]+)/g;
const MD_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function renderTextWithLinks(input, keyPrefix) {
  const text = String(input || "")
    .replace(/^\s*(?:\d+[\.\)]\s*)+/, "")
    .replace(/\*\*/g, "");
  const nodes = [];
  MD_LINK_REGEX.lastIndex = 0;
  let cursor = 0;
  let match;
  let part = 0;

  while ((match = MD_LINK_REGEX.exec(text)) !== null) {
    const before = text.slice(cursor, match.index);
    if (before) {
      nodes.push(...renderPlainUrls(before, `${keyPrefix}-before-${part}`));
    }

    nodes.push(
      <a
        key={`${keyPrefix}-md-${part}`}
        href={match[2]}
        target="_blank"
        rel="noreferrer"
        className="text-[#1e3a8a] underline underline-offset-2 hover:text-[#2849aa]"
      >
        {match[1]}
      </a>
    );

    cursor = match.index + match[0].length;
    part += 1;
  }

  const tail = text.slice(cursor);
  if (tail) {
    nodes.push(...renderPlainUrls(tail, `${keyPrefix}-tail`));
  }

  return nodes;
}

function renderPlainUrls(text, keyPrefix) {
  const nodes = [];
  URL_REGEX.lastIndex = 0;
  let cursor = 0;
  let match;
  let part = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const before = text.slice(cursor, match.index);
    if (before) nodes.push(before);

    nodes.push(
      <a
        key={`${keyPrefix}-url-${part}`}
        href={match[1]}
        target="_blank"
        rel="noreferrer"
        className="text-[#1e3a8a] underline underline-offset-2 hover:text-[#2849aa]"
      >
        {match[1]}
      </a>
    );

    cursor = match.index + match[0].length;
    part += 1;
  }

  const tail = text.slice(cursor);
  if (tail) nodes.push(tail);
  return nodes;
}

function RoadmapCard({ items = [] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-[#1e3a8a]">Learning Roadmap</h3>
      <ol className="space-y-2 text-sm text-slate-700">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="rounded-md bg-slate-50 p-2">
            {index + 1}. {renderTextWithLinks(item, `item-${index}`)}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default RoadmapCard;
