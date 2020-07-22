const fs = require("fs");
const employees = JSON.parse(fs.readFileSync('../data/json/Employees_TEST.json', 'utf-8'))
const items = JSON.parse(fs.readFileSync('../data/json/opsuiteLsMerged.json', 'utf-8'))
const transactions = JSON.parse(fs.readFileSync('../data/json/opsuiteTransactions-2017.json', 'utf-8'))
const paymentTypes = JSON.parse(fs.readFileSync('../data/json/paymentTypes.json', 'utf-8'))


const merged = transactions.transactions.map((transaction) => {
  employee =
    employees.Employee.find(
      (employee) =>
        employee.firstName + " " + employee.lastName === transaction.cashierName
    ) || {};
  item = items.find((item) => item.customSku === transaction.sku) || {};
  payment =
    paymentTypes.PaymentType.find(
      (payment) => payment.name == transaction.tenderDescription
    ) || {};
  {
    return {
      cashierID: employee.employeeID || '2',
      cashierName: transaction.cashierName || 'Antony Bill',
      discountReason: transaction.discountReason,
      discount: transaction.discount,
      cost: transaction.cost,
      description: transaction.description,
      note: transaction.note,
      itemID: item.id,
      sku: item.customSku,
      qty: transaction.qty,
      cost: transaction.cost,
      unitPrice: transaction.unitPrice,
      netLineSale: transaction.netLineSale,
      tax: transaction.tax,
      lineSaleValue: transaction.lineSaleValue,
      totalSale: transaction.totalSale,
      taxCode: transaction.taxCode,
      receiptDate: transaction.receiptDate,
      tenderDescription: transaction.tenderDescription,
      tenderType: transaction.tenderType,
      transactionID: transaction.transactionID,
      paymentType: payment.paymentTypeID,
    };
  }
});

let na = merged
  .map((x) => {
    let {
      cashierID,
      cashierName,
      discountReason,
      discount,
      cost,
      description,
      note,
      itemID,
      sku,
      qty,
      unitPrice,
      netLineSale,
      tax,
      lineSaleValue,
      taxCode,
      totalSale,
      receiptDate,
      tenderDescription,
      tenderType,
      transactionID,
      paymentType,
    } = x;
    return {
      employeeID: cashierID,
      registerID: 1,
      shopID: 1,
      completed: true,
      completeTime: new Date(receiptDate),
      referenceNumber: transactionID,
      referenceNumberSource: "Opsuite",
      SaleLines: {
        SaleLine: [
          {
            itemID: itemID,
            unitPrice: unitPrice,
            calcTax1: tax,
            unitQuantity: qty,
            //...(discount && { discountAmount: discount }),
            discountAmount: discount.split("-").join("") || 0,
            // prettier-ignore
            // 4457 = Gun Repairs
            ...(itemID === "4457" && { unitPrice: unitPrice }),
            ...(itemID === "4457" && { Note: note }),
            // 4441 - 2nd Hand Goods
            ...(itemID === "4441" && { unitPrice: unitPrice }),
            ...(itemID === "4441" && { Note: note }),
            // 4439 - Miscellaneous Item
            ...(itemID === "4439" && { unitPrice: unitPrice }),
            ...(itemID === "4439" && { Note: note }),
            // 4478 - Post & Packing
            ...(itemID === "4478" && { unitPrice: unitPrice }),
            ...(itemID === "4478" && { Note: note }),
            // 4455 - Deposit
            ...(itemID === "4455" && { unitPrice: unitPrice }),
            ...(itemID === "4455" && { Note: note }),
            // 539 - Parcelforce
            ...(itemID === "539" && { unitPrice: unitPrice }),
            // 4430 - Gift Voucher
            ...(itemID === "4430" && { unitPrice: unitPrice }),
            ...(tax && parseFloat(tax) > 0 && { tax: true }),
            ...(tax && parseInt(tax) === 0 && { tax: false }),
            ...(tax && parseFloat(tax) > 0 && { calTax1: tax.split("-").join("") || 0}),
          },
        ],
      },
      SalePayments: {
        SalePayment: {
          ...(totalSale && {
            amount: totalSale.map(x=> parseFloat(x.value)).reduce((sum, cur) => (sum + cur), 0).toFixed(2)
          }),
          // ...(totalSale && { amount: totalSale.reduce( ( sum , cur ) => sum + parseFloat(cur.value).toFixed(2), 0).toString().split("-").join("") }) || 0,
          paymentTypeID: paymentType || 1,
        },
      },
    };
  })
  .reduce((a, v) => {
    if (a.every((x) => x.referenceNumber !== v.referenceNumber)) {
      return [...a, v];
    }
    return a.map((x) => {
      if (x.referenceNumber === v.referenceNumber) {
        x.SaleLines.SaleLine = x.SaleLines.SaleLine.concat(
          v.SaleLines.SaleLine
        );
      }
      return x;
    });
  }, []);

  console.log(na.itemID)
  
fs.writeFile(
  "../data/json/transactionsToPost_TEST.json", JSON.stringify(na, null, 2), (err) => {
    console.error(err);
  }
);
