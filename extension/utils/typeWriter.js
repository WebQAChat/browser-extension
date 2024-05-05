class typeWriterAnimation {
     constructor(message, speed, messageContainer, submitBtn){
          this.message = message;
          this.speed = speed;
          this.textIndex = 0;
          this.messageContainer = messageContainer;
          this.submitBtn = submitBtn;
          this.typingInterval;
     }

     typeWriter(){
          this.typeAnimation();
     }

     typeWriterEffect(){
          if (this.textIndex < this.message.length) {
               this.messageContainer.innerHTML += this.message.charAt(this.textIndex);
               this.textIndex++;
          } else {
               if(this.submitBtn){
                    this.submitBtn.removeAttribute('disabled');
               }
               clearInterval(this.typingInterval);
               this.messageContainer.classList.remove('currentMessage');
          }
     }

     typeAnimation(){
          this.typingInterval = setInterval(this.typeWriterEffect.bind(this), this.speed);
     }
};