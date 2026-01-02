import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';

/**
 * Zenn スタイルのファイル名付きコードブロックを実現する remark プラグイン
 *
 * Markdown で `言語:ファイル名` の形式（例: ```js:foobar.js）と書くと、
 * コードブロックの上部にファイル名が表示されます。
 */
export default function remarkCodeTitle() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      const lang = node.lang;
      if (!lang || typeof lang !== 'string') return;

      // コロンで分割してファイル名を抽出
      const colonIndex = lang.indexOf(':');
      if (colonIndex === -1) return;

      const language = lang.slice(0, colonIndex);
      const filename = lang.slice(colonIndex + 1);

      if (!filename) return;

      // 言語を更新
      node.lang = language;

      // メタにファイル名を追加
      const existingMeta = node.meta || '';
      node.meta = existingMeta
        ? `${existingMeta} title="${filename}"`
        : `title="${filename}"`;
    });
  };
}
