export const camelize = function(str) {
  return str.split(' ').map((s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }).join('');
};
