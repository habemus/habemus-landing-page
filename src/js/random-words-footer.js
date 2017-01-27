// animate word change on footer
$(document).ready(function() {
  
  var words = [
    "web",
    "empoderamento", 
    "criatividade", 
    "solução",
    "poder",
    "conquista",
    "transformação",
    "revolução",
    "capacidade",
    "ação",
    "atitude",
    "autonomia",
    "código",
    "luz",
    "projeto",
    "resposta",
    "liberdade",
    "igualdade",
    "democracia",
    "comunidade",
    "pavê de chocolate",
    "pudim",
    "brigadeiro",
    "tudo",
    "café", 
    "☘",
    "🤓",
    "👾",
    "♫",
    "😍",
    "⛄",
    "🤖",
    "🚴",
    "💪🏽",
    "❤",
    "🐶",
    "🐵",
    "🐽",
    "🐭",
    "🍌",
    "🍄",
    "🎃",
    "🎈",
    "💻",
  ];
  $(".words").on("mouseenter", function() {
    console.log("passou");
    var item = words[Math.floor(Math.random()*words.length)];
    $("#word-change").text(item);
  });
});
