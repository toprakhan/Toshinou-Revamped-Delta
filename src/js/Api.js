class Api {
	constructor() {
		this._blackListedBoxes = [];
		this.gates = [];
		this.boxes = {};
		this.ships = {};
		this.battlestation = null;
		this.lastMovement = 0;
		this.isDisconnected = false;
		this.disconnectTime = null;
		this.reconnectTime = null;
		this.jumpTime = $.now();
		this.resetBlackListTime = $.now();
		this.blackListTimeOut = 150000
		this.getSettingsTime = $.now();
		this.setSettingsTime = $.now();
		this.rute = null;
		this.starSystem = [];
		this.workmap = null;
		this.changeConfigTime = $.now();
		this.autoLocked = false;
		this.lastAutoLock = $.now();
		this.habilityCoolDown = 1;
		this.habilityCoolDownTwo = 1;
		this.habilityCoolDownThree = 1;
		this.habilityCoolDownFour = 1;
		this.changeFormationTime = $.now();
		this.RSBTime = $.now();
		this.formation = -1;
		this.ammunition = -1;
		this.resetTargetWhenHpBelow25Percent = false;
		this.sentinelship = null;
		this.attacking = false;
		this.map52 = [];
		this.rutePirateMaps = null;
	}

	useHability() {
		var cooldownlist = {"cyborg":311000,"solace":141000,"diminisher":162000,"venom":181000,"sentinel":236000,"spectrum":211000,"v-lightning":186000,"aegis":101000,"spearhead":401000,"citadel":46000,"mimesis":361000,"hammerclaw":171000,"tartarus":28000};
		if (this.habilityCoolDown && $.now() - this.habilityCoolDown > cooldownlist[window.hero.skillName]) {
			this.quickSlot(window.globalSettings.habilitySlot);
			this.habilityCoolDown = $.now();
			return true;
		}
		return false;
	}

	useHabilityTwo() {
		var cooldownlist = {"aegis":36000,"spearhead":200000,"citadel":51000, "mimesis":301000,"hammerclaw":101000,"tartarus":71000};
		if (this.habilityCoolDownTwo && $.now() - this.habilityCoolDownTwo > cooldownlist[window.hero.skillName]) {
			this.quickSlot(window.globalSettings.habilitySlotTwo);
			this.habilityCoolDownTwo = $.now();
			return true;
		}
		return false;
	}

	useHabilityThree() {
		var cooldownlist = {"aegis":131000,"spearhead":56000,"citadel":71000, "hammerclaw":147000};
		if (this.habilityCoolDownThree && $.now() - this.habilityCoolDownThree > cooldownlist[window.hero.skillName]) {
			this.quickSlot(window.globalSettings.habilitySlotThree);
			this.habilityCoolDownThree = $.now();
			return true;
		}
		return false;
	}

	useHabilityFour() {
		var cooldownlist = {"citadel":370000,"spearhead":150000};
		if (this.habilityCoolDownFour && $.now() - this.habilityCoolDownFour > cooldownlist[window.hero.skillName]) {
			this.quickSlot(window.globalSettings.habilitySlotFour);
			this.habilityCoolDownFour = $.now();
			return true;
		}
		return false;
	}

	getShipName(fullname) {
		let namelist = /ship_(.*?)(_|$)/g;
		let rname = namelist.exec(fullname);
		let shipType = "";
		if (rname != null) {
			if (rname[1] == "a-veteran" || rname[1] == "a-elite") {
				shipType = "aegis";
			} else if (rname[1] == "c-veteran" || rname[1] == "c-elite") {
				shipType = "citadel";
			} else if (rname[1] == "s-veteran" || rname[1] == "s-elite") {
				shipType = "spearhead";
			} else {
				shipType = rname[1];
			}
			return shipType;
		} else {
			return false;
		}
	}

	changeFormation(n) {
		if (this.changeFormationTime && $.now() - this.changeFormationTime > 3000) {
			this.changeFormationTime = $.now();
			this.formation = n;
			this.quickSlot(n);
			return true;
		} else {
			return false;
		}
	}

	quickSlot(n) {
		if (n>=0 && n< 10) {
			let slots = [48,49,50,51,52,53,54,55,56,57];
			this.pressKey(slots[n]);
			setTimeout(() => {
				this.pressKey(slots[n]);
			}, 700);
		}
	}

	pressKey(n) {
		Injector.injectScript('document.getElementById("preloader").pressKey('+n+');');
	}

	changeRefreshCount(n) {
		chrome.storage.local.set({"refreshCount": n});
	}

	changeAmmunition(ammo) {
		if(this.ammunition != ammo) {
			switch(ammo) {
				case 1:
					this.quickSlot(window.globalSettings.x1Slot);
					break;
				case 2:
					this.quickSlot(window.globalSettings.x2Slot);
					break;
				case 3:
					this.quickSlot(window.globalSettings.x3Slot);
					break;
				case 4:
					this.quickSlot(window.globalSettings.x4Slot);
					break;
				case 6:
					this.quickSlot(window.globalSettings.sabSlot);
					break;
				case 45:
					if ($.now() - this.RSBTime > 3000) {
						this.quickSlot(window.globalSettings.rsbSlot);
						this.ammunition = ammo;
						this.RSBTime = $.now();
						setTimeout(() => {
							this.quickSlot(window.globalSettings.x4Slot);
							this.ammunition = 4;
						}, 500);
					} else {
						this.quickSlot(window.globalSettings.x4Slot);
						this.ammunition = 4;
					}
					break;
				default:
					this.quickSlot(window.globalSettings.x1Slot);
			}	
			this.ammunition = ammo;
		}
	}

	lockShip(ship) {
		if (!(ship instanceof Ship))
			return;

		if (this.ships[ship.id] == null)
			return;

		ship.update();
		let pos = ship.position;
		let scr = 'document.getElementById("preloader").lockShip(' + ship.id + ',' + Math.round(pos.x) + ',' + Math.round(pos.y) + ',' + Math.round(window.hero.position.x) + ',' + Math.round(window.hero.position.y) + ');';
		Injector.injectScript(scr);

		this.lockTime = $.now();
	}

	lockNpc(ship) {
		if (!(ship instanceof Ship))
			return;

		if (this.ships[ship.id] == null)
			return;

		this.lockTime = $.now();

		this.lockShip(ship);
	}

	reconnect() {
		Injector.injectScript('document.getElementById("preloader").reconnect();');
		this.reconnectTime = $.now();
	}

	collectBox(box) {
		if (!(box instanceof Box))
			return;

		if (this.boxes[box.hash] == null)
			return;

		if (MathUtils.random(1, 100) >= window.settings.collectionSensitivity) {
			return;
		}

		Injector.injectScript('document.getElementById("preloader").collectBox' + box.hash + '()');

		this.collectTime = $.now();
	}

	moveWithFilter(x, y) {
		if (window.hero.mapId == 93) {
			this.moveFor52(x, y);
		} else if (!window.bigMap && ((x < 200 || x > 20800) || (y < 200 || y > 12900))) {
			x = MathUtils.random(200, 20800);
			y = MathUtils.random(200, 12900);
			this.move(x, y);
			window.movementDone = false;
		}  else if (window.bigMap && ((x < 500 || x > 41500) || (y < 500 || y > 25700))) {
			x = MathUtils.random(500, 41500);
			y = MathUtils.random(500, 25700);
			this.move(x, y);
			window.movementDone = false;
		} else {
			this.move(x, y);
			window.movementDone = false;
		}
	}

	move(x, y) {
		if (!isNaN(x) && !isNaN(y)) {
			if(window.invertedMovement){
				x = x + ((window.hero.position.x - x)*2);
				y = y + ((window.hero.position.y - y)*2);
			}
			window.hero.move(new Vector2D(x, y));
		}
	}

	blackListHash(hash) {
		this._blackListedBoxes.push(hash);
	}

	isOnBlacklist(hash) {
		return this._blackListedBoxes.includes(hash);
	}

	startLaserAttack() {
		this.pressKey(17);
	}

	jumpGate() {
		this.pressKey(74);
	}

	changeConfig() {
		if (this.changeConfigTime && $.now() - this.changeConfigTime > 5000) {
			this.changeConfigTime = $.now();
			this.pressKey(67);
			return true;
		} else {
			return false;
		}
	}

	getSettings() {
		for (let key in window.settings) {
			chrome.storage.sync.get(key, function(set) {
				window.newSettings[key] = set[key];
			})
		}
		this.getSettingsTime = $.now();
	}

	setSettings() {
		chrome.storage.sync.set(window.settings);
		this.setSettingsTime = $.now();
	}

	updateSettings() {
		window.settings = window.newSettings;
	}

	resetTarget(target) {
		if (target == "enemy") {
			this.targetShip = null;
			this.attacking = false;
			this.triedToLock = false;
			this.lockedShip = null;
			this.ammunition = -1;
		} else if (target == "box") {
			this.targetBoxHash = null;
		} else if (target == "all") {
			this.targetShip = null;
			this.attacking = false;
			this.triedToLock = false;
			this.lockedShip = null;
			this.targetBoxHash = null;
			this.ammunition = -1;
		}
	}

	jumpInGateByType(gateType, settings) {
		if (settings) {
			let gate = this.findNearestGatebyGateType(gateType);
			if (gate.gate) {
				let x = gate.gate.position.x;
				let y = gate.gate.position.y;
				if (window.hero.position.distanceTo(gate.gate.position) < 200 && this.jumpTime && $.now() - this.jumpTime > 3000) {
					this.jumpGate();
					this.jumpTime = $.now();
				}
				this.resetTarget("all");
				this.move(x, y);
				window.movementDone = false;
			}
		}
	}

	jumpInGateByID(gateId){
		let hasJumped = false;
		let gate = this.findGatebyID(gateId);
		if (gate.gate) {
			let x = gate.gate.position.x + MathUtils.random(-100, 100);
			let y = gate.gate.position.y + MathUtils.random(-100, 100);
			if (window.hero.position.distanceTo(gate.gate.position) < 200 && this.jumpTime && $.now() - this.jumpTime > 3000) {
				this.jumpGate();
				this.jumpTime = $.now();
				hasJumped = true;
			}
			this.resetTarget("all");
			this.move(x, y);
			window.movementDone = false;
		}
		return hasJumped;
	}

	jumpAndGoBack(gateId){
		if (window.globalSettings.workmap != null) {
			this.workmap = window.globalSettings.workmap;
		} else {
			this.workmap = window.hero.mapId;
		}
		let hasJumped = this.jumpInGateByID(gateId);

		return hasJumped;
	}

	ggDeltaFix() {
		let shipsCount = Object.keys(this.ships).length;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && (ship.name == "-=[ StreuneR ]=- δ4" || 
					ship.name == "-=[ Lordakium ]=- δ9" || 
					ship.name == "-=[ Sibelon ]=- δ14" || 
					ship.name == "-=[ Kristallon ]=- δ19" ||
					ship.name == "..::{ Boss Lordakium }::... δ23" ||
					ship.name == "..::{ Boss Lordakium }::... δ25" ||
					ship.name == "..::{ Boss Lordakium }::... δ21")) {
				this.resetTargetWhenHpBelow25Percent=false;
				if (shipsCount > 1) {
					window.settings.setNpc(ship.name, "0");
					if (this.targetShip == ship) {
						this.resetTarget("enemy");
					}
				} else {
					window.settings.setNpc(ship.name, "9");
					this.targetShip = ship;
				}
			}
		}
	}

	ggZetaFix() {
		let shipsCount = Object.keys(this.ships).length;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && (ship.name == "-=[ Devourer ]=- ζ25" || ship.name == "-=[ Devourer ]=- ζ27")) {
				this.resetTargetWhenHpBelow25Percent=false;
				if (shipsCount > 1) {
					window.settings.setNpc(ship.name, "0");
					if (this.targetShip == ship) {
						this.resetTarget("enemy");
					}
				} else {
					window.settings.setNpc(ship.name, "9");
					this.targetShip = ship;
				}
			}
		}
	}

	protegitmode() {
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && (ship.name == "-=[ Cubikon ]=-") && ship.distanceTo(window.hero.position) < 1000) {
				let shipsCount = this.countNpcAroundByName("-=[ Protegit ]=-", 2000);
				if (shipsCount > 1 && !(lockedShip && lockedShip.percentOfHp < 5 && lockedShip.name == "-=[ Cubikon ]=-")) {
					window.settings.setNpc(ship.name, true);
					if (lockedShip && lockedShip.percentOfHp < 99 && lockedShip.name == "-=[ Cubikon ]=-") {
						this.resetTarget("enemy");
						window.settings.setNpc(ship.name, false);
					}
					if (this.targetShip == ship) {
						this.resetTarget("enemy");
					}
				} else {
					window.settings.setNpc(ship.name, false);
					this.targetShip = ship;
				}
			}
		}
	}

	countNpcAroundByName(name, distance){
		let shipsCount = Object.keys(this.ships).length;
		let shipsAround = 0;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && (ship.distanceTo(window.hero.position) < distance) && (ship.name == name)) {
				shipsAround++;
			}
		}
		return shipsAround;
	}

	countNpcAround(distance){
		let shipsCount = Object.keys(this.ships).length;
		let shipsAround = 0;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && ship.distanceTo(window.hero.position) <= distance) {
				shipsAround++;
			}
		}
		return shipsAround;
	}

	findNearestBox() {
		let minDist = 100000;
		let finalBox;

		if (!window.globalSettings.bonusBox && !window.globalSettings.materials && !window.settings.palladium && !window.globalSettings.cargoBox && !window.globalSettings.greenOrGoldBooty && !window.globalSettings.redBooty && !window.globalSettings.blueBooty && !window.globalSettings.masqueBooty) {
			return {
				box: null,
				distance: minDist
			};
		}

		if (window.settings.palladium) {
			minDist = 1000;
		}

		for (let property in this.boxes) {
			let box = this.boxes[property];
			let dist = box.distanceTo(window.hero.position);
			if (dist < minDist) {
				if (!box.isResource() && ((box.isCollectable() && window.globalSettings.bonusBox) ||
						((box.isMaterial() || box.isDropRes()) && window.globalSettings.materials) ||
						(box.isPalladium() && window.settings.palladium) ||
						(box.isCargoBox() && window.globalSettings.cargoBox) ||
						(box.isGreenOrGoldBooty() && window.globalSettings.greenOrGoldBooty && window.greenOrGoldBootyKeyCount > 0) ||
						(box.isRedBooty() && window.globalSettings.redBooty && window.redBootyKeyCount > 0) ||
						(box.isBlueBooty() && window.globalSettings.blueBooty && window.blueBootyKeyCount > 0) ||
						(box.isMasqueBooty() && window.globalSettings.masqueBooty && window.masqueBootyKeyCount > 0))) {
					finalBox = box;
					minDist = dist;
				}
			}
		}
		return {
			box: finalBox,
			distance: minDist
		};
	}


	findNearestShip() {
		let minDist = 100000;
		let finalShip;
		let minPriority = 1;

		if (!window.settings.killNpcs) {
			return {
				ship: null,
				distance: minDist
			};
		}

		for (let property in this.ships) {
			let ship = this.ships[property];
			ship.update();
			if ((ship.isNpc  && (!window.settings.onlyAnswerAttacks || (window.settings.onlyAnswerAttacks && ship.attacksUs))) || 
					(!ship.isNpc && window.globalSettings.respondPlayerAttacks && ship.attacksUs && ship.isEnemy)) {
				if (!ship.isNpc) {
					finalShip = ship;
					let dist = ship.distanceTo(window.hero.position);
					return {
						ship: finalShip,
						distance: dist
					};
				}
				let npcdata =  window.settings.getNpc(ship.name);
				let priority = npcdata["priority"];
				if (priority >= minPriority) {
					if (!ship.isAttacked) {
						finalShip = ship;
						minPriority = priority;
					}
				}
			}
		}

		for (let property in this.ships) {
			let ship = this.ships[property];
			ship.update();
			if ((ship.isNpc  && (!window.settings.onlyAnswerAttacks || (window.settings.onlyAnswerAttacks && ship.attacksUs))) || 
					(!ship.isNpc && window.globalSettings.respondPlayerAttacks && ship.attacksUs && ship.isEnemy)) {
				let npcdata =  window.settings.getNpc(ship.name);
				let priority = npcdata["priority"];
				if (priority >= minPriority) {
					let dist = ship.distanceTo(window.hero.position);
					if (dist < minDist) {
						if (!ship.isAttacked) {
							finalShip = ship;
							minDist = dist;
							minPriority = priority;
						}
					}
				}
			}
		}

		return {
			ship: finalShip,
			distance: minDist
		};
	}

	findNearestGate() {
		let minDist = 100000;
		let finalGate;

		this.gates.forEach(gate => {
			if (gate.gateId != 150000409 && gate.gateId != 150000410 && gate.gateId != 150000411 && (gate.gateType == 1 || gate.gateType == 51 || gate.gateType == 52)) {
				let dist = window.hero.distanceTo(gate.position);
				if (dist < minDist) {
					finalGate = gate;
					minDist = dist;
				}
			}
		});

		return {
			gate: finalGate,
			distance: minDist
		};
	}

	findNearestGateForRunAway(enemy) {
		let minDist = 100000;
		let finalGate;
		this.gates.forEach(gate => {
			if (gate.gateId != 150000409 && gate.gateId != 150000410 && gate.gateId != 150000411 && (gate.gateType == 1 || gate.gateType == 51 || gate.gateType == 52)) {
				let enemeyDistance = enemy.distanceTo(gate.position);
				let dist = window.hero.distanceTo(gate.position);
				if (enemeyDistance < dist) {
					return;
				}

				if (dist < minDist) {
					finalGate = gate;
					minDist = dist;
				}
			}
		});

		return {
			gate: finalGate,
			distance: minDist
		};
	}

	findNearestGatebyGateType(gateType) {
		let minDist = 100000;
		let finalGate;

		this.gates.forEach(gate => {
			let dist = window.hero.distanceTo(gate.position);
			if (dist < minDist && gate.gateType == gateType) {
				finalGate = gate;
				minDist = dist;
			}
		});

		return {
			gate: finalGate,
			distance: minDist
		};
	}

	markHeroAsDead() {
		this.heroDied = true;
		Injector.injectScript("window.heroDied = true;");
	}

	checkForCBS(){
		let result = {
				walkAway: false,
				cbsPos: null,
		};
		result.cbsPos = this.battlestation.position;
		let dist = this.battlestation.distanceTo(window.hero.position);
		if (dist < 1500) {
			result.walkAway = true;
		}
		return result;
	}

	checkForEnemy() {
		let result = {
				run: false,
				enemy: null,
				edist: 100000
		};
		let enemyDistance = 100000;
		let enemyShip;
		for (let property in this.ships) {
			let ship = this.ships[property];
			ship.update();
			if (!ship.isNpc && ship.isEnemy) {
				let dist = ship.distanceTo(window.hero.position);
				if (enemyDistance > dist) {
					enemyDistance = dist;
					result.edist = dist;
					result.enemy = ship;
				}
			}
		}
		if (enemyDistance < 2000) {
			result.run = true;
			return result;
		}
		return result;
	}

	countShipsAround(distance) {
		let shipsCount = Object.keys(this.ships).length;
		let shipsAround = 0;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && ship.distanceTo(window.hero.position) < distance && !ship.isNpc) {
				shipsAround++;
			}
		}
		return shipsAround;
	}

	findGatebyID(gateId) {
		let finalGate;

		this.gates.forEach(gate => {
			if (gate.gateId == gateId) {
				finalGate = gate;
			}
		});

		return {
			gate: finalGate,
		};
	}

	goToMap(idWorkMap){
		if (this.rute == null) {
			this.fillStarSystem();
			let mapSystem = {1:{2:1},2:{1:1,3:1,4:1},3:{2:1,7:1,4:1},4:{2:1,3:1,13:2,13:1},13:{4:1,14:2,15:2,16:2},5:{6:1},6:{5:1,7:1,8:1},7:{6:1,3:1,8:1},8:{6:1,7:1,14:2,11:1},14:{8:1,13:2,15:2,16:2},9:{10:1},10:{9:1,12:1,11:1},
					11:{10:1,8:1,12:1},12:{10:1,11:1,15:2,4:1},15:{12:1,14:2,13:2,16:2},16:{13:2,14:2,15:2,17:1,21:1,25:1},29:{17:1,21:1,25:1},17:{16:2,29:3,19:1,18:1},18:{17:1,20:1},19:{17:1,20:1},20:{18:1,19:1},21:{16:2,29:3,22:1,23:1},22:{21:1,24:1},23:{21:1,24:1},24:{23:1,22:1},25:{29:3,16:2,27:1,26:1},27:{25:1,28:1},26:{25:1,28:1},28:{26:1,27:1}},
					graph = new Graph(mapSystem);
			let imcompleteRute = graph.findShortestPath(window.hero.mapId, idWorkMap);
			if (imcompleteRute != null) {
				this.rute = this.completeRute(imcompleteRute);
			}
		} else {
			let map = this.rute[0];
			let portal = map.portals[0];
			if (window.hero.mapId == map.mapId) {
				this.jumpInGateByID(portal.gateId);
			} else if (window.hero.mapId == portal.idLinkedMap) {
				this.rute.shift(); 
			} else if (window.hero.mapId != map.mapId && window.hero.mapId == portal.idLinkedMap) {
			  this.rute = null;
			}
		}
	}

	fillStarSystem(){
		this.starSystem = [];
		let portals11 = [];
		portals11.push(new Portal(150000156,2));
		this.starSystem.push(new Map(1, portals11));
		let portals12 = [];
		portals12.push(new Portal(150000157,1));
		portals12.push(new Portal(150000158,3));
		portals12.push(new Portal(150000160,4));
		this.starSystem.push(new Map(2, portals12));
		let portals13 = [];
		portals13.push(new Portal(150000159,2));
		portals13.push(new Portal(150000182,4));
		portals13.push(new Portal(150000162,7));
		this.starSystem.push(new Map(3, portals13));
		let portals14 = [];
		portals14.push(new Portal(150000161,2));
		portals14.push(new Portal(150000183,3));
		portals14.push(new Portal(150000186,13));
		portals14.push(new Portal(150000166,12));
		this.starSystem.push(new Map(4, portals14));
		let portals21 = [];
		portals21.push(new Portal(150000171,6)); /* 2-1 | 2-2 */
		this.starSystem.push(new Map(5, portals21));
		let portals22 = [];
		portals22.push(new Portal(150000165,7)); /* 2-2 | 2-3 */
		portals22.push(new Portal(150000172,8)); // 2-2 | 2-4
		portals22.push(new Portal(150000170,5)); // 2-2 | 2-4
		this.starSystem.push(new Map(6, portals22));
		let portals23 = [];
		portals23.push(new Portal(150000163,3)); // 2-3 | 1-3
		portals23.push(new Portal(150000180,8)); // 2-3 | 2-4
		portals23.push(new Portal(150000164,6)); // 2-3 | 2-2
		this.starSystem.push(new Map(7, portals23));
		let portals24 = [];
		portals24.push(new Portal(150000181,7)); // 2-4 | 2-3
		portals24.push(new Portal(150000188,14)); // 2-4 | 4-2
		portals24.push(new Portal(150000173,6)); // 2-4 | 2-2
		portals24.push(new Portal(150000174,11)); // 2-4 | 3-3
		this.starSystem.push(new Map(8, portals24));
		let portals31 = [];
		portals31.push(new Portal(150000179,10)); // 3-1 | 3-2
		this.starSystem.push(new Map(9, portals31));
		let portals32 = [];
		portals32.push(new Portal(150000177,11)); // 3-2 | 3-3
		portals32.push(new Portal(150000169,12)); // 3-2 | 3-4
		portals32.push(new Portal(150000178,9)); // 3-2 | 3-1
		this.starSystem.push(new Map(10, portals32));
		let portals33 = [];
		portals33.push(new Portal(150000175,8)); // 3-3 | 2-4
		portals33.push(new Portal(150000185,12)); // 3-3 | 3-4
		portals33.push(new Portal(150000176,10)); // 3-3 | 3-2
		this.starSystem.push(new Map(11, portals33));
		let portals34 = [];
		portals34.push(new Portal(150000167,4));
		portals34.push(new Portal(150000190,15));
		portals34.push(new Portal(150000184,11));
		portals34.push(new Portal(150000168,10));
		this.starSystem.push(new Map(12, portals34));
		let portals43 = [];
		portals43.push(new Portal(150000191,12)); // 4-3 | 3-4
		portals43.push(new Portal(150000195,14)); // 4-3 | 4-2
		portals43.push(new Portal(150000196,13)); // 4-3 | 4-1
		portals43.push(new Portal(150000278,16)); // 4-3 | 4-4
		this.starSystem.push(new Map(15, portals43));
		let portals41 = [];
		portals41.push(new Portal(150000187,4)); // 4-1 | 1-4
		portals41.push(new Portal(150000192,14)); // 4-1 | 4-2
		portals41.push(new Portal(150000197,15)); // 4-1 | 4-3
		portals41.push(new Portal(150000274,16)); // 4-1 | 4-4
		this.starSystem.push(new Map(13, portals41));
		let portals42 = [];
		portals42.push(new Portal(150000189,8)); // 4-2 | 2-4
		portals42.push(new Portal(150000193,13)); // 4-2 | 4-1
		portals42.push(new Portal(150000194,15)); // 4-2 | 4-3
		portals42.push(new Portal(150000276,16)); // 4-2 | 4-4
		this.starSystem.push(new Map(14, portals42));
		let portals44 = [];
		portals44.push(new Portal(150000303,25)); // 4-4 | 3-5
		portals44.push(new Portal(150000279,15)); // 4-4 | 4-3
		portals44.push(new Portal(150000277,14)); // 4-4 | 4-2
		portals44.push(new Portal(150000293,21)); // 4-4 | 2-5
		portals44.push(new Portal(150000283,17)); // 4-4 | 1-5
		portals44.push(new Portal(150000275,13)); // 4-4 | 4-1
		this.starSystem.push(new Map(16, portals44));
		let portals45 = [];
		portals45.push(new Portal(150000314,17)); // 4-5 | 1-5
		portals45.push(new Portal(150000316,21)); // 4-5 | 2-5
		portals45.push(new Portal(150000318,25)); // 4-5 | 3-5
		this.starSystem.push(new Map(29, portals45));
		let portals15 = [];
		portals15.push(new Portal(150000284,16)); // 1-5 | 4-4
		portals15.push(new Portal(150000313,29)); // 1-5 | 4-5
		portals15.push(new Portal(150000285,18)); // 1-5 | 1-6
		portals15.push(new Portal(150000287,19)); // 1-5 | 1-7
		this.starSystem.push(new Map(17, portals15));
		let portals16 = [];
		portals16.push(new Portal(150000286,17)); // 1-6 | 1-5
		portals16.push(new Portal(150000289,20)); // 1-6 | 1-8
		this.starSystem.push(new Map(18, portals16));
		let portals17 = [];
		portals17.push(new Portal(150000291,20)); // 1-7 | 1-8
		portals17.push(new Portal(150000288,17)); // 1-7 | 1-5
		this.starSystem.push(new Map(19, portals17));
		let portals18 = [];
		portals18.push(new Portal(150000290,18)); // 1-8 | 1-6
		portals18.push(new Portal(150000292,19)); // 1-8 | 1-7
		this.starSystem.push(new Map(20, portals18));
		let portals25 = [];
		portals25.push(new Portal(150000294,16)); // 2-5 | 4-4
		portals25.push(new Portal(150000315,29)); // 2-5 | 4-5
		portals25.push(new Portal(150000295,22)); // 2-5 | 2-6
		portals25.push(new Portal(150000297,23)); // 2-5 | 2-7
		this.starSystem.push(new Map(21, portals25));
		let portals26 = [];
		portals26.push(new Portal(150000296,21)); // 2-6 | 2-5
		portals26.push(new Portal(150000299,24)); // 2-6 | 2-8
		this.starSystem.push(new Map(22, portals26));
		let portals27 = [];
		portals27.push(new Portal(150000298,21)); // 2-7 | 2-5
		portals27.push(new Portal(150000301,24)); // 2-7 | 2-8
		this.starSystem.push(new Map(23, portals27));
		let portals28 = [];
		portals28.push(new Portal(150000300,22)); // 2-8 | 2-6
		portals28.push(new Portal(150000302,23)); // 2-8 | 2-7
		this.starSystem.push(new Map(24, portals28));
		let portals35 = [];
		portals35.push(new Portal(150000304,16)); // 3-5 | 4-4
		portals35.push(new Portal(150000317,29)); // 3-5 | 4-5
		portals35.push(new Portal(150000305,26)); // 3-5 | 3-6
		portals35.push(new Portal(150000307,27)); // 3-5 | 3-7
		this.starSystem.push(new Map(25, portals35));
		let portals36 = [];
		portals36.push(new Portal(150000306,25)); // 3-6 | 3-5
		portals36.push(new Portal(150000309,28)); // 3-6 | 3-8
		this.starSystem.push(new Map(26, portals36));
		let portals37 = [];
		portals37.push(new Portal(150000308,25)); // 3-7 | 3-5
		portals37.push(new Portal(150000311,28)); // 3-7 | 3-8
		this.starSystem.push(new Map(27, portals37));
		let portals38 = [];
		portals38.push(new Portal(150000312,27)); // 3-8 | 3-7
		portals38.push(new Portal(150000310,26)); // 3-8 | 3-6
		this.starSystem.push(new Map(28, portals38));
	}

	completeRute(imcompleteRute){
		let rute = [];
		for (let i = 0;i < imcompleteRute.length; i++) {
			let idWorkMap = imcompleteRute[i];
			let nextMap = imcompleteRute[i + 1];
			for (let e = 0;e < this.starSystem.length;e++) {
				if (this.starSystem[e].mapId == idWorkMap) {
					let map = this.starSystem[e];
					let portalschosen = this.returnANextPortal(map.portals,nextMap);
					let arrayPortals = [];
					arrayPortals.push(portalschosen);
					rute.push(new Map(map.mapId,arrayPortals));
				}
			}
		}
		return rute;
	}

	returnANextPortal(portals,idGoMap){
		for (let i = 0;i < portals.length; i++) {
			if (portals[i].idLinkedMap == idGoMap) {
				return portals[i];
			}
		}
	}

	attackMode() {
		if (window.globalSettings.autoChangeConfig && window.globalSettings.attackConfig != window.hero.shipconfig) {
			this.changeConfig();
		}
		if (window.globalSettings.changeFormation && window.globalSettings.attackFormation != api.formation) {
			this.changeFormation(window.globalSettings.attackFormation);
		}
	}

	speedMode() {
		let changeVelo = false;
		if (window.globalSettings.autoChangeConfig) {
			if(window.globalSettings.flyingConfig != window.hero.shipconfig) {
				if (this.changeConfig()) {
					changeVelo = true;
				}
			}
		}
		if (window.globalSettings.changeFormation && api.formation != window.globalSettings.flyingFormation) {
			if (this.changeFormation(window.globalSettings.flyingFormation)) {
				changeVelo = true;
			}
		}
		return changeVelo;
	}

	escapeMode() {
		let changeVelo = false;
		if (window.globalSettings.autoChangeConfig) {
			if (window.globalSettings.escapeConfig != window.hero.shipconfig) {
				if (this.changeConfig()) {
					changeVelo = true;
				}
			}
		}
		if (window.globalSettings.changeFormation && api.formation != window.globalSettings.escapeFormation) {
			if (this.changeFormation(window.globalSettings.escapeFormation)) {
				changeVelo = true;
			}
		}
		return changeVelo;
	}

	chooseAmmunition() {
		let ammunition = 1;
		if (this.targetShip.isNpc) {
			ammunition = parseInt(window.settings.getNpc(this.targetShip.name)["ammo"]);
		} else {
			ammunition = parseInt(window.globalSettings.playerAmmo);
		}
		if (this.targetShip.shd > 200 && (ammunition == 11 || ammunition == 21 || ammunition == 31 || ammunition == 41)) {
			this.changeAmmunition(6);
		} else if (this.targetShip.shd < 200 && (ammunition == 11 || ammunition == 21 || ammunition == 31 || ammunition == 41)) {
			switch(ammunition) {
				case 11:
					this.changeAmmunition(1);
			        break;
				case 21:
					this.changeAmmunition(2);
			        break;
				case 31:
					this.changeAmmunition(3);
			        break;
				case 41:
					this.changeAmmunition(4);
			        break;
			}
		} else {
			this.changeAmmunition(ammunition);
		}
	}

	moveFor52(finX, finY) {
		if (this.map52 == null || this.map52.length <= 0) {
			this.completeMap52();
		} else { 
			let startZone = this.get52IDZone(window.hero.position.x, window.hero.position.y);
			if (startZone != null && startZone != 0) {
				let endZone = this.get52IDZone(finX, finY);
				if (endZone !=0 && startZone != endZone) {
					if (this.rutePirateMaps != null) {
						let nextZone = api.get52Zone(this.rutePirateMaps[0]);
						if (nextZone != null) {
							if (window.hero.position.x == nextZone.conectorX && window.hero.position.y == nextZone.conectorY) {
								this.rutePirateMaps.shift();
							}
							this.move(nextZone.conectorX, nextZone.conectorY);
							window.movementDone = false;
						} else {
							this.rutePirateMaps = null;
						}
					} else {
						let rute52 = {1:{2:1},2:{1:1,3:1},3:{2:1,4:1},4:{3:1,5:1},5:{4:1,6:1},6:{5:1},7:{6:1},8:{7:1},9:{8:1}},
						graph = new Graph(rute52);
						this.rutePirateMaps = graph.findShortestPath(startZone, endZone);
					}
				} else {
					this.rutePirateMaps = null;
					this.move(finX, finY);
					window.movementDone = false;
				}
			} else {
				this.rutePirateMaps = null;
				this.move(finX, finY);
				window.movementDone = false;
			}
		}

	}

	get52Zone(id) {
		for (let i = 0;i < this.map52.length; i++) {
			if (this.map52[i].id == id) {
				return this.map52[i];
			}
		} 
	}

	get52IDZone(x, y) {
		let id = 0;
		for (let i = 0;i < this.map52.length; i++) {
			if (this.map52[i].minX < x && this.map52[i].maxX > x && this.map52[i].minY < y && this.map52[i].maxY > y) {
				id = this.map52[i].id;
				return id;
			}
		}
		return id;
	}

	completeMap52() {
		var zone1 = {
				id: 1,
				minX: 33205,
				minY: 204,
				maxX: 41640,
				maxY: 14160,
				conectorX: 32715,
				conectorY: 13998
		};
		var hall1 = {
				id: 2,
				minX: 28747,
				minY: 13642,
				maxX: 32716,
				maxY: 14261,
				conectorX: 28932,
				conectorY: 14266
		};
		var hall2 = {
				id: 3,
				minX: 28747,
				minY: 14264,
				maxX: 29087,
				maxY: 16821,
				conectorX: 28933,
				conectorY: 16449
		};
		var hall3 = {
				id: 4,
				minX: 29304,
				minY: 16203,
				maxX: 29950,
				maxY: 16859,
				conectorX: 29915,
				conectorY: 16401
		};
		var prePalla = {
				id: 5,
				minX: 30114,
				minY: 16203,
				maxX: 32180,
				maxY: 17851,
				conectorX: 31547,
				conectorY: 17830
		};
		var palla = {
				id: 6,
				minX: 11934,
				minY: 18105,
				maxX: 32294,
				maxY: 25514,
				conectorX: 30300,
				conectorY: 18200
		};
		var mineZone = {
				id: 7,
				minX: 5214,
				minY: 210,
				maxX: 11744,
				maxY: 26346,
				conectorX: 11569,
				conectorY: 17966
		};
		var hall4 = {
				id: 8,
				minX: 3181,
				minY: 15083,
				maxX: 5156,
				maxY: 15547,
				conectorX: 5150,
				conectorY: 15379
		};
		var zone2 = {
				id: 9,
				minX: 360,
				minY: 7801,
				maxX: 2887,
				maxY: 19200,
				conectorX: 2880,
				conectorY: 15271
		};

		this.map52.push(zone1);
		this.map52.push(hall1);
		this.map52.push(hall2);
		this.map52.push(hall3);
		this.map52.push(prePalla);
		this.map52.push(palla);
		this.map52.push(mineZone);
		this.map52.push(hall4);
		this.map52.push(zone2);

	}
}