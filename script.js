const $ = (e) => document.querySelector(e);

@param typeevent 
const on = (typeevent, el, callback) => {
  el.addEventListener(typeevent, (e) => callback(e));
};
const normalize = (function () {
  var from =
      "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç!¡¿?#$%&|´´`ªº^Ç*+/¨¨=(){}[].,;:_°>\\<\"'",
    to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
    mapping = {};

  for (var i = 0, j = from.length; i < j; i++)
    mapping[from.charAt(i)] = to.charAt(i);

  return function (str, urls = true) {
    var ret = [];
    for (var i = 0, j = str.length; i < j; i++) {
      var c = str.charAt(i);
      if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
      else ret.push(c);
    }
    return urls
      ? ret.join("")
      : ret
          .join("")
          .replace(/[^-A-Za-z0-9]+/g, "-")
          .toLowerCase();
  };
})();
const copyTextToClipboard = (text) => {
  if (!navigator.clipboard) {
    console.error("Async: Could not copy text: ", err);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!", text);
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
};
const fromTo = (x) => {
  [
    { from: /[a]/g, to: "ai", search: "a" },
    { from: /[e]/g, to: "enter", search: "e" },
    { from: /[i]/g, to: "imes", search: "i" },
    { from: /[o]/g, to: "ober", search: "o" },
    { from: /[u]/g, to: "ufat", search: "u" }
  ].forEach(({ from, to, search }) => {
    x = x === search ? x.replace(from, to) : x;
  });
  return x;
};
const encrypt = (text) => {
  text = text
    .split("")
    .map((letra) => fromTo(letra))
    .join("");
  return [text];
};
const decrypt = (text) => {
  [
    { from: /(ai)/g, to: "a" },
    { from: /(enter)/g, to: "e" },
    { from: /(imes)/g, to: "i" },
    { from: /(ober)/g, to: "o" },
    { from: /(ufat)/g, to: "u" }
  ].forEach(({ from, to }) => {
    text = text.replace(from, to);
  });
  return [text];
};
const render = () => {
  const $result = $('[data-one="result"]'),
    $header = $('[data-one="header"]'),
    $footer = $('[data-one="footer"]'),
    $text = $('[data-one="text"]'),
    $text_hidden = $('[data-one="text-hidden"]'),
    $btn_encrypt = $('[data-one="encrypt"]'),
    $btn_decrypt = $('[data-one="decrypt"]'),
    $result_copy = $('[data-one="copy-result"]'),
    $btn_copy = $('[data-one="copy"]');
  const textEncrypt = () => {
    const { value } = $text;
    const [newTextEncrypt] = encrypt(normalize(value.toLowerCase()));
    $text_hidden.value = newTextEncrypt;
    return newTextEncrypt;
  };
  const textDecrypt = () => {
    const { value } = $text;
    const [newTextDecrypt] = decrypt(value);
    $text_hidden.value = newTextDecrypt;
    return newTextDecrypt;
  };
  const textResult = (type) => {
    const { value } = $text;
    $header.style.display = value ? "none" : "block";
    $footer.style.display = !value ? "none" : "block";
    $result.innerHTML = value
      ? `${type === "encrypt" ? textEncrypt() : textDecrypt()}`
      : "Ingresa el texto que desees encriptar o desencriptar.";
  };
  on("click", $btn_encrypt, () => {
    textResult("encrypt");
  });
  on("click", $btn_decrypt, () => {
    textResult("decrypt");
  });
  on("click", $btn_copy, () => {
    $result_copy.style.display = 'block';
    setTimeout(() => {
      $result_copy.style.display = 'none';
    },3000);
    copyTextToClipboard($text_hidden.value);
  });
};

window.addEventListener("DOMContentLoaded", () => render());