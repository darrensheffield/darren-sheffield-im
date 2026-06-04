(() => {
  const decode = (codes) => String.fromCharCode(...codes);
  const parts = [
    [100, 97, 114, 114, 101, 110],
    [115, 104, 101, 102, 102, 105, 101, 108, 100],
    [105, 109]
  ];
  const scheme = decode([109, 97, 105, 108, 116, 111, 58]);
  const address = `${decode(parts[0])}@${decode(parts[1])}.${decode(parts[2])}`;

  document.querySelectorAll("[data-email-action]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = `${scheme}${address}`;
    });
  });
})();
