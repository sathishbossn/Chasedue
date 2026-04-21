function formatAmount(value) {
  return Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculateGST(taxableValue, gstRate = 18, intraState = true) {
  const totalGst = (taxableValue * gstRate) / 100;
  const totalAmount = taxableValue + totalGst;
  if (intraState) {
    return { taxableValue, cgstRate: gstRate/2, cgstAmount: totalGst/2, sgstRate: gstRate/2, sgstAmount: totalGst/2, totalGst, totalAmount };
  }
  return { taxableValue, cgstRate: 0, cgstAmount: 0, sgstRate: 0, sgstAmount: 0, igstRate: gstRate, igstAmount: totalGst, totalGst, totalAmount };
}

function amountToWords(amount) {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function convertHundreds(n) {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n/100)] + ' Hundred' + (n % 100 ? ' ' + convertHundreds(n % 100) : '');
  }
  function convertIndian(n) {
    if (n === 0) return 'Zero';
    let result = '';
    const crore = Math.floor(n / 10000000); n %= 10000000;
    const lakh = Math.floor(n / 100000); n %= 100000;
    const thou = Math.floor(n / 1000); n %= 1000;
    if (crore) result += convertHundreds(crore) + ' Crore ';
    if (lakh) result += convertHundreds(lakh) + ' Lakh ';
    if (thou) result += convertHundreds(thou) + ' Thousand ';
    if (n) result += convertHundreds(n);
    return result.trim();
  }
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let words = 'Rupees ' + convertIndian(rupees);
  if (paise > 0) words += ' and ' + convertIndian(paise) + ' Paise';
  return words + ' Only';
}

function renderLineItems(items) {
  return items.map((item, i) => `
    <tr>
      <td class="td-sno">${i + 1}</td>
      <td class="td-desc">${item.description}${item.subtitle ? `<div class="td-desc-sub">${item.subtitle}</div>` : ''}</td>
      <td class="td-hsn mono">${item.hsn || '—'}</td>
      <td class="td-qty">${item.qty}</td>
      <td class="td-unit">${item.unit || '—'}</td>
      <td class="td-rate mono">${formatAmount(item.rate)}</td>
      <td class="td-amount mono">${formatAmount(item.amount)}</td>
    </tr>`).join('');
}

module.exports = { formatAmount, calculateGST, amountToWords, renderLineItems };
