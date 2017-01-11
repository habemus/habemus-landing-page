// animate text on section home
$(function(){
  $("#typed").typed({
    // strings: ["Typed.js is a <strong>jQuery</strong> plugin.", "It <em>types</em> out sentences.", "And then deletes them.", "Try it out!"],
    strings: [
      "uma landing page incrível", 
      "um website atraente", 
      "uma animação parallax",
      "um webapp angular", 
      "uma visualização de dados interativa",
      "um game",
      "qualquer coisa que puder imaginar",
      "tudo o que quiser",
      "a web"],
    // stringsElement: $('#typed-strings'),
    typeSpeed: 60,
    backDelay: 2000,
    loop: false,
    contentType: 'text', // or text
    // defaults to false for infinite loop
    loopCount: false,
    showCursor: true,
    attr: null,
    callback: function(){ foo(); },
    resetCallback: function() { newTyped(); }
  });
  
  $(".reset").click(function(){
      $("#typed").typed('reset');
  });
});


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
    console.log("clicou");
    var item = words[Math.floor(Math.random()*words.length)];
    $("#word-change").text(item);
  });
});