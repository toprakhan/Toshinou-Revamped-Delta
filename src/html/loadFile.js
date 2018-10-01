
  function loadArchive() {
	var files = document.getElementById('files').files;
    if (!files.length) {
      return;
    }
    var file = files[0];
    var reader = new FileReader();
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
    	var items = $.parseJSON(evt.target.result);
    	if (items.headerColor)
	      $("#headerColor").val(items.headerColor);
	    if (items.headerOpacity)
	      $("#headerOpacity").val(items.headerOpacity);
	    if (items.windowColor)
	      $("#windowColor").val(items.windowColor);
	    if (items.windowOpacity)
	      $("#windowOpacity").val(items.windowOpacity);
	    if (items.timerTick)
	      $("#timerTick").val(items.timerTick);
	    if (items.enableRefresh)
	      $("#enableRefresh").prop('checked', true);
	    if(items.refreshToReconnect)
	      $("#refreshToReconnect").prop('checked', true);
	    if (items.refreshTime)
	      $("#refreshTime").val(items.refreshTime);
	    if (items.speedFormat) {
	      let sel = `#speedFormat_${items.speedFormat}`;
	      $(sel).prop('checked', true);
	    }
	    if (items.windowsToTabs) {
	      $("#windowsToTabs").prop('checked', true);
	    }
	    if (items.autoChangeConfig) {
	      $("#autoChangeConfig").prop('checked', true);
	    }
	    if (items.attackConfig) {
	      $("#attackConfig").val(items.attackConfig);
	    }
	    if (items.flyingConfig) {
	      $("#flyingConfig").val(items.flyingConfig);
	    }
	    if (items.changeFormation) {
	      $("#changeFormation").prop('checked', true);
	    }
	    if (items.attackFormation) {
	      $("#attackFormation").val(items.attackFormation);
	    }
	    if (items.flyingFormation) {
	      $("#flyingFormation").val(items.flyingFormation);
	    }
	    if (items.useHability) {
	      $("#useHability").prop('checked', true);
	    }
	    if (items.habilitySlot) {
	      $("#habilitySlot").val(items.habilitySlot);
	    }
	    if (items.habilitySlotTwo) {
	      $("#habilitySlotTwo").val(items.habilitySlotTwo);
	    }
	    if (items.habilitySlotThree) {
	      $("#habilitySlotThree").val(items.habilitySlotThree);
	    }
	    if (items.habilitySlotFour) {
	      $("#habilitySlotFour").val(items.habilitySlotFour);
	    }
	    if (items.workmap) {
	      $("#workmap").val(items.workmap);
	    }
	    if (items.reviveType) {
	      $("#reviveType").val(items.reviveType);
	    }
	    if (items.reviveLimit) {
	      $("#reviveLimit").val(items.reviveLimit);
	    }
	    if (items.bonusBox) {
	      $("#bonusBox").prop('checked', true);
	    }
	    if (items.materials) {
	      $("#materials").prop('checked', true);
	    }
	    if (items.cargoBox) {
	      $("#cargoBox").prop('checked', true);
	    }
	    if (items.greenOrGoldBooty) {
	      $("#greenOrGoldBooty").prop('checked', true);
	    }
	    if (items.redBooty) {
	      $("#redBooty").prop('checked', true);
	    }
	    if (items.blueBooty) {
	      $("#blueBooty").prop('checked', true);
	    }
	    if (items.masqueBooty) {
	      $("#masqueBooty").prop('checked', true);
	    }
	    if (items.collectBoxWhenCircle) {
	      $("#collectBoxWhenCircle").prop('checked', true);
	    }
	    if (items.workmap) {
	      $("#workmap").val(items.workmap);
	    }
	    if (items.changeAmmunition) {
	      $("#changeAmmunition").prop('checked', true);
	    }
	    if (items.x1Slot) {
	      $("#x1Slot").val(items.x1Slot);
	    }
	    if (items.x2Slot) {
	      $("#x2Slot").val(items.x2Slot);
	    }
	    if (items.x3Slot) {
	      $("#x3Slot").val(items.x3Slot);
	    }
	    if (items.x4Slot) {
	      $("#x4Slot").val(items.x4Slot);
	    }
	    if (items.sabSlot) {
	      $("#sabSlot").val(items.sabSlot);
	    }
	    if (items.stopafterxminutes) {
	      $("#stopafterxminutes").val(items.stopafterxminutes);
	    }
	    if (items.waitafterRepair) {
	      $("#waitafterRepair").val(items.waitafterRepair);
	    }
	    if (items.fleeFromEnemy) {
	      $("#fleeFromEnemy").prop('checked', true);
	    }
	    if (items.jumpFromEnemy) {
	      $("#jumpFromEnemy").prop('checked', true);
	    }
	    if (items.dodgeTheCbs) {
          $("#dodgeTheCbs").prop('checked', true);
        }
	    if (items.moveRandomly) {
	      $("#moveRandomly").prop('checked', true);
	    }
	    if (items.alpha) {
	      $("#alpha").prop('checked', true);
	    }
	    if (items.beta) {
	      $("#beta").prop('checked', true);
	    }
	    if (items.gamma) {
	      $("#gamma").prop('checked', true);
	    }
	    if (items.delta) {
	      $("#delta").prop('checked', true);
	    }
	    if (items.epsilon) {
	      $("#epsilon").prop('checked', true);
	    }
	    if (items.zeta) {
	      $("#zeta").prop('checked', true);
	    }
        if (items.kappa) {
	      $("#kappa").prop('checked', true);
	    }
	    if (items.lambda) {
	      $("#lambda").prop('checked', true);
	    }
	    if (items.kronos) {
	      $("#kronos").prop('checked', true);
	    }
	    if (items.hades) {
	      $("#hades").prop('checked', true);
	    }
	    if (items.kuiper) {
	      $("#kuiper").prop('checked', true);
	    }
	    if (items.npcList) {
	      var knownNpcList = items.npcList;
		  for (i = 0; i < knownNpcList.length; i++) {
		      $("#name"+i).val(knownNpcList[i]["name"]);
		      $("#range"+i).val(knownNpcList[i]["range"]);
		      $("#ammo"+i).val(knownNpcList[i]["ammo"]);
		      $("#priority"+i).val(knownNpcList[i]["priority"]);
		  }
	    }
      }
    };
    reader.readAsText(file);
  }
  
  document.querySelector('.loadFile').addEventListener('click', function(evt) {
	loadArchive();
  }, false);
  