$(document).ready(function () {
  var elements = document.querySelectorAll(".table-scrollable");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("scroll", function () {
      var translate = "translate(0," + this.scrollTop + "px)";
      this.querySelector("thead").style.transform = translate;
    });
  }
});
