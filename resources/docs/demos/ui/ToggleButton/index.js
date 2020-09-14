namespace `docs.demos.ui` (
	class ToggleButton extends WebComponent  {
		async onConnected(){
            await super.onConnected();

            this.knob = this.querySelector(".knob");
            this.direction = -1;
            this.addEventListener("click", e => this.onClick(e), false);
            this.addEventListener("transitionend", e => this.onStyleComputed(e));
        }

        async onStyleComputed(style){
            await wait(100);
            this.bounds = this.getBoundingClientRect();
            this.knob_bounds = this.knob.getBoundingClientRect();

            var style = window.getComputedStyle(this.knob);
            this.matrix = new DOMMatrix(style.transform);
        }

        onClick(){
            this.direction *= -1;
            this.onRender();
        }

        get x() {
            return this.direction > 0 ?
                this.bounds.width-this.knob_bounds.width-6 : 0;
        }

        onRender(){
            var vector = {x: this.x, y:0, z:0 }
            this.knob.style.transform = `
                translate3d(${vector.x||0}px,${vector.y||0}px,${vector.z||this.matrix.m43}px)
            `;
        }
	}
)