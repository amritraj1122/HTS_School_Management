function showConfirm(message) {
  return new Promise((resolve) => {
    const result = confirm(message);

    resolve(result);
  });
}
