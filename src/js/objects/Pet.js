class Pet {
    constructor(id) {
		this.id = id;
		this.destroyed = false;
		this.activated = true;
		this.currentModule = -1;
		this.activateTimer = $.now();
		this.moduleCooldown = -1;
	}
}