const Display = class {
  constructor() {
    this.form = document.createElement(`form`);
    this.textarea = document.createElement(`textarea`);
    this.input = document.createElement(`input`);
    
    this.form.style.cssText = `
      position: fixed;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      min-width: 100px;
      min-height: 100px;
      padding: 5px;
      background-color: #fff;
      border: 1px solid #333;
      border-radius: 5px;
    `;
    this.textarea.style.cssText = `
      flex-grow: 1;
    `;
    
    this.input.name = `evalInput`;
    this.textarea.setAttribute(`readonly`, `true`);
    
    this.execute = this.execute.bind(this);
    
    this.form.addEventListener(`submit`, this.execute);
    
    this.form.append(this.textarea, this.input);
    document.body.append(this.form);
  }
  
  show(value) {
    this.textarea.textContent = value;
  }
  
  execute(ev) {
    ev.preventDefault();
    const value = ev.target[this.input.name].value;
    
    switch(value) {
      case `cls`:
      this.clearTextarea();
      this.resetInput();
      return;
    }
    try{
      (new Function(value))();
      this.resetInput();
    } catch(error) {
      this.show(error.message);
    }
    
  }
  
  resetInput() {
    this.input.value = ``;
  }
  
  clearTextarea() {
    this.textarea.textContent = ``;
  }
}