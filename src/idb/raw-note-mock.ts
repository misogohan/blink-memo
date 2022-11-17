import { RawNote } from "./data-structure.js";

export const rawNote: RawNote = {
  name: '古文単語帳',
  options: { textFlow: 'utd' },
  chapters: [
    { name: '読解必修語', pages: [
      { headline: 'おどろく', content: { items: [{ type: 'text', text: 'カ行四段' }, { type: 'text', text: '（はっと）気づく。' }, { type: 'text', text: '（ふと）目を覚ます。' }], detail: '【驚く】\n物音などで「はっとする」の意が基本。眠っている場面では「ふと目を覚ます」の意になる。' } },
      { headline: 'ののしる', content: { items: [{ type: 'text', text: 'ラ行四段' }, { type: 'text', text: '大騒ぎする。大声で騒ぐ。' }, { type: 'text', text: '評判になる。噂になる。' }], detail: '「大きな声を出して騒ぐ」が基本の意味。悪い意味合いはない。世間が騒ぐことから「評判になる」の意が生じた。' } },
    ] },
    { name: '入試必修語', pages: [
      { headline: 'にほふ', content: { items: [{ type: 'text', text: 'ハ行四段' }, { type: 'text', text: '美しく照り映える。美しく輝く。' }], detail: '【匂ふ】\n「丹」（＝赤い色）に「秀」（＝秀でている）が付いて動詞化した。本来は視覚的な美しさを表す。平安時代から嗅覚的な香りの良さも表すようになった。' } },
      { headline: 'うつろふ', content: { items: [{ type: 'text', text: 'ハ行四段' }, { type: 'text', text: '色が変わる。紅葉する。（葉や花が）散る。' }, { type: 'text', text: '（心が）写る。心変わりする。' }], detail: '【移ろふ】\n「移る」の未然形に反復・継続の助動詞「ふ」がついて一語化した。「移りゆく（変化する）」意味を表す。' } },
    ] },
  ]
};
