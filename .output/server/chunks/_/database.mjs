var ActivationCodeStatus = /* @__PURE__ */ ((ActivationCodeStatus2) => {
  ActivationCodeStatus2["UNUSED"] = "\u672A\u4F7F\u7528";
  ActivationCodeStatus2["ACTIVATED"] = "\u5DF2\u6FC0\u6D3B";
  ActivationCodeStatus2["EXPIRED"] = "\u5DF2\u8FC7\u671F";
  ActivationCodeStatus2["REVOKED"] = "\u5DF2\u540A\u9500";
  return ActivationCodeStatus2;
})(ActivationCodeStatus || {});
var OperationType = /* @__PURE__ */ ((OperationType2) => {
  OperationType2["GENERATE"] = "\u751F\u6210";
  OperationType2["ACTIVATE"] = "\u6FC0\u6D3B";
  OperationType2["REVOKE"] = "\u540A\u9500";
  OperationType2["EXPORT"] = "\u5BFC\u51FA";
  OperationType2["MODIFY"] = "\u4FEE\u6539";
  OperationType2["LOGIN"] = "\u767B\u5F55";
  return OperationType2;
})(OperationType || {});

export { ActivationCodeStatus as A, OperationType as O };
//# sourceMappingURL=database.mjs.map
