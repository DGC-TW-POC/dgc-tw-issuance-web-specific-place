// Restricts input for the given textbox to the given inputFilter function.
export const setInputFilter = function (textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        if (this.value) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.oldValue = "";
        }
      } else {
        this.value = "";
        this.oldValue = "";
      }
    });
  });
}

export const joiTypeMessage = {
  "string.empty" : "不能為空值",
  "any.required" : "必須填寫"
}
export const verifyTWIdentifier = function (id) {
  id = id.trim();
  
  let verification = id.match("^[A-Z][12]\\d{8}$")
  if(!verification){
    return false
  }
  let conver = "ABCDEFGHJKLMNPQRSTUVXYWZIO"
  let weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]

  id = String(conver.indexOf(id[0]) + 10) + id.slice(1);

  let checkSum = 0
  for (let i = 0; i < id.length; i++) {
      let c = parseInt(id[i])
      let w = weights[i]
      checkSum += c * w
  }

  return checkSum % 10 == 0
}