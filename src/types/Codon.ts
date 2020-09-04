type Codon = string;
function validateCodon(s: string) : s is Codon {
  return typeof s === 'string' && /^[UCGA]{3}$/.test(s);
}

export {
  Codon,
  validateCodon
};
