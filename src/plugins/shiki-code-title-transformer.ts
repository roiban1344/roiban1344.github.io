import type { ShikiTransformer } from 'shiki';

/**
 * Shiki transformer: Zenn スタイルのファイル名付きコードブロックを実現
 *
 * meta に title="ファイル名" が含まれている場合、
 * コードブロックの上部にファイル名を表示するラッパーを追加します。
 */
const codeTitleTransformer: ShikiTransformer = {
  name: 'code-title',
  pre(node) {
    const meta = this.options.meta?.__raw;
    if (!meta || typeof meta !== 'string') return;

    // title="..." を抽出
    const titleMatch = meta.match(/title="([^"]+)"/);
    if (!titleMatch) return;

    const filename = titleMatch[1];

    // 現在の pre 要素の内容をコピー
    const preChildren = [...node.children];
    const preProperties = { ...node.properties };

    // pre を div.code-block-wrapper に変換
    node.tagName = 'div';
    node.properties = { class: 'code-block-wrapper' };
    node.children = [
      // ファイル名タイトル
      {
        type: 'element',
        tagName: 'div',
        properties: { class: 'code-title' },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { class: 'code-title-filename' },
            children: [{ type: 'text', value: filename }],
          },
        ],
      },
      // 元の pre 要素
      {
        type: 'element',
        tagName: 'pre',
        properties: preProperties,
        children: preChildren,
      },
    ];
  },
};

export default codeTitleTransformer;
