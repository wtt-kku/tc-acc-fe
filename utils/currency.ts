const toShowCurrency = (x: number) => {
  let t = x.toFixed(2);
  return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default toShowCurrency;
