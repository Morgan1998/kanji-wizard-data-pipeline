import kuromoji from 'kuromoji';


const builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict/'
});

export const getTokenizer = () => {
  return new Promise((resolve, reject) => {
    builder.build((err, tokenizer) => {
      if (err) reject(err);
      else resolve(tokenizer);
    });
  });
};