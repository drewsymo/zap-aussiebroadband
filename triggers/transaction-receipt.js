const sample = require("../samples/transaction-receipt");

const toDollars = (cents) => {
  return cents * 0.01;
};

const triggerReceipt = async (z, bundle) => {
  const response = await z.request({
    method: "GET",
    url: "https://myaussie-api.aussiebroadband.com.au/billing/transactions?group=true",
  });

  const json = JSON.parse(response.content);

  const receipts = [];

  Object.keys(json).forEach((monthId) => {
    json[monthId].forEach((transaction) => {
      if (transaction.type === "receipt") {
        receipts.push({
          id: transaction["id"],
          type: transaction["type"],
          time: transaction["time"],
          monthId,
          description: transaction["description"],
          amountCents: transaction["amountCents"],
          amountCentsAbs: Math.abs(transaction["amountCents"]),
          amountDollars: toDollars(transaction["amountCents"]),
          amountDollarsAbs: Math.abs(toDollars(transaction["amountCents"])),
        });
      }
    });
  });

  return receipts.sort((a, b) => b.id - a.id);
};

module.exports = {
  key: "receipt",
  noun: "Receipt",
  display: {
    label: "Get Receipts",
    description: "Triggers when new receipts are generated.",
  },
  operation: {
    perform: triggerReceipt,
    sample: sample,
  },
};
